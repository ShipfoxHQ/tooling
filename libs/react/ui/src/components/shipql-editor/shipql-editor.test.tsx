import {describe, expect, it, vi} from '@shipfox/vitest/vi';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ShipQLEditor} from './shipql-editor';

describe('ShipQLEditor', () => {
  it('preserves invalid state when switching to text mode with free text disallowed', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<ShipQLEditor allowFreeText={false} defaultValue="error" onChange={onChange} />);

    await user.click(await screen.findByRole('button', {name: 'Switch to free text mode'}));

    const input = await screen.findByRole('textbox', {name: 'ShipQL query editor'});

    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('marks free-text leaves invalid after the editor blurs', async () => {
    const onChange = vi.fn();
    const {container} = render(
      <ShipQLEditor allowFreeText={false} defaultValue="error service:api" onChange={onChange} />,
    );

    const editor = await screen.findByLabelText('ShipQL query editor');
    fireEvent.focus(editor);
    fireEvent.blur(editor);

    await waitFor(() => {
      const leafNodes = Array.from(container.querySelectorAll('[data-shipql-leaf="true"]'));
      const textLeaf = leafNodes.find((node) => node.textContent === 'error');
      expect(textLeaf).toBeTruthy();
      expect(textLeaf).toHaveClass('bg-tag-error-bg');
    });
    expect(onChange).not.toHaveBeenCalled();
  });
});
