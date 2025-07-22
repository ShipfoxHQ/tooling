import {readFileSync} from 'node:fs';
import core from '@actions/core';
import github from '@actions/github';
import type {components} from '@octokit/openapi-webhooks-types';
import {nixExecSync} from 'src/utils';

type PullRequestEvent = components['schemas']['webhook-pull-request-opened'];
type PushEvent = components['schemas']['webhook-push'];
type WorkflowDispatchEvent = components['schemas']['webhook-workflow-dispatch'];

type Event = PullRequestEvent | PushEvent | WorkflowDispatchEvent;

let _event: Event | undefined;

function getEvent(): Event {
  if (_event) return _event;
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) throw new Error('GITHUB_EVENT_PATH is not set');
  const rawEvent = readFileSync(eventPath, 'utf8');
  core.debug(rawEvent);
  _event = JSON.parse(rawEvent) as Event;
  return _event;
}

const botAccounts = ['shipfox-deploy-bot'];

interface EventDetails {
  actor: string;
  isBotActor: boolean;
  event: Event;
  eventName: string;
  isOnMain: boolean;
}

let _eventDetails: EventDetails | undefined;

function getEventDetails(): EventDetails {
  if (_eventDetails) return _eventDetails;
  const eventName = github.context.eventName;
  core.debug(`Event name: ${eventName}`);
  const actor = github.context.actor;
  core.debug(`Actor: ${actor}`);
  const isBotActor = botAccounts.includes(actor);
  core.debug(`Is bot actor: ${isBotActor}`);
  const event = getEvent();
  const isOnMain = 'ref' in event && event.ref === 'refs/heads/main';
  core.debug(`Is on main: ${isOnMain}`);
  _eventDetails = {
    actor,
    isBotActor,
    event,
    eventName,
    isOnMain,
  };
  return _eventDetails;
}

function getTurboBase(): string {
  const {event} = getEventDetails();
  if ('pull_request' in event) return event.pull_request.base.sha;
  if ('before' in event) return event.before;
  return 'origin/main';
}

function getNodeVersion(): string {
  const output = nixExecSync('node --version');
  return output.trim().slice(1);
}

function getPnpmVersion(): string {
  const output = nixExecSync('pnpm --version');
  return output.trim();
}

interface Context {
  turboBase: string;
  versions: {
    node: string;
    pnpm: string;
  };
}

let _context: Context | undefined;

export function getContext(): Context {
  if (!_context)
    _context = {
      turboBase: getTurboBase(),
      versions: {
        node: getNodeVersion(),
        pnpm: getPnpmVersion(),
      },
    };
  core.debug(`Context: ${JSON.stringify(_context)}`);
  return _context;
}
