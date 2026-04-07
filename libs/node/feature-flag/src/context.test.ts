import {describe, expect, it} from '@shipfox/vitest/vi';
import {mapContext, mapContextToLDContext} from './context';

describe('mapContext', () => {
  it('maps BlankContext with targetingKey and anonymous', () => {
    const result = mapContext({kind: 'blank'});

    expect(result).toEqual({targetingKey: 'blank', anonymous: true});
  });

  it('maps OrganizationContext with targetingKey and kind', () => {
    const result = mapContext({kind: 'organization', id: 'org-123'});

    expect(result).toEqual({targetingKey: 'org-123', kind: 'organization'});
  });

  it('maps UserContext with targetingKey, kind, and organizationId', () => {
    const result = mapContext({kind: 'user', id: 'user-456', organizationId: 'org-123'});

    expect(result).toEqual({
      targetingKey: 'user-456',
      kind: 'user',
      organizationId: 'org-123',
    });
  });

  it('maps RunnerContext with targetingKey, kind, and all runner attributes', () => {
    const result = mapContext({
      kind: 'runner',
      id: 'runner-789',
      organizationId: 'org-123',
      architecture: 'amd64',
      cpu: 4,
      ram: 8,
      osType: 'linux',
      osName: 'ubuntu',
      osVersion: '22.04',
      infrastructureProvider: 'gcp',
    });

    expect(result).toEqual({
      targetingKey: 'runner-789',
      kind: 'runner',
      organizationId: 'org-123',
      architecture: 'amd64',
      cpu: 4,
      ram: 8,
      osType: 'linux',
      osName: 'ubuntu',
      osVersion: '22.04',
      infrastructureProvider: 'gcp',
    });
  });
});

describe('mapContextToLDContext', () => {
  it('maps BlankContext with key and anonymous', () => {
    const result = mapContextToLDContext({kind: 'blank'});

    expect(result).toEqual({kind: 'blank', anonymous: true, key: 'blank'});
  });

  it('maps OrganizationContext with key and kind', () => {
    const result = mapContextToLDContext({kind: 'organization', id: 'org-123'});

    expect(result).toEqual({kind: 'organization', key: 'org-123'});
  });
});
