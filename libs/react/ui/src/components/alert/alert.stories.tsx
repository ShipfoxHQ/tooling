import {zodResolver} from '@hookform/resolvers/zod';
import type {Meta, StoryObj} from '@storybook/react';
import {Button} from 'components/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from 'components/form';
import {Input} from 'components/input';
import {Header} from 'components/typography';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {
  Alert,
  AlertAction,
  AlertActions,
  AlertClose,
  AlertContent,
  AlertDescription,
  AlertTitle,
} from './alert';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'info', 'success', 'warning', 'error'],
    },
  },
  args: {
    variant: 'default',
  },
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

const variants = ['default', 'info', 'success', 'warning', 'error'] as const;

export const Default: Story = {
  render: (args) => {
    return (
      <Alert {...args}>
        <AlertContent>
          <AlertTitle>Title</AlertTitle>
          <AlertDescription>Description</AlertDescription>
          <AlertActions>
            <AlertAction>Download</AlertAction>
            <AlertAction>View</AlertAction>
          </AlertActions>
        </AlertContent>
        <AlertClose />
      </Alert>
    );
  },
};

const validationFormSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type ValidationFormValues = z.infer<typeof validationFormSchema>;

function ErrorValidationToasterExample() {
  const [showError, setShowError] = useState(false);
  const form = useForm<ValidationFormValues>({
    resolver: zodResolver(validationFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: ValidationFormValues) {
    // biome-ignore lint/suspicious/noConsole: <we need to log the data for the story>
    console.log('Form submitted:', data);
    setShowError(false);
  }

  function onError() {
    setShowError(true);
  }

  const errors = form.formState.errors;
  const errorCount = Object.keys(errors).length;
  const errorMessage =
    errorCount > 0
      ? `Please fix ${errorCount} error${errorCount > 1 ? 's' : ''} before submitting.`
      : '';

  return (
    <div className="flex flex-col gap-16 w-full max-w-md">
      {errorCount > 0 && (
        <Alert variant="error" open={showError} autoClose={5000} onOpenChange={setShowError}>
          <AlertContent>
            <AlertTitle>Validation Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
            <AlertActions>
              <AlertAction
                onClick={() => {
                  form.clearErrors();
                  setShowError(false);
                }}
              >
                Dismiss
              </AlertAction>
            </AlertActions>
          </AlertContent>
          <AlertClose />
        </Alert>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export const WithFormValidation: Story = {
  render: () => <ErrorValidationToasterExample />,
};

export const DesignMock: Story = {
  render: () => {
    return (
      <div className="flex flex-col gap-32 pb-64 pt-32 px-32 bg-background-neutral-base">
        <Header variant="h3" className="text-foreground-neutral-subtle">
          ALERTS
        </Header>
        <div className="flex flex-col gap-16">
          {variants.map((variant) => (
            <Alert key={variant} variant={variant}>
              <AlertContent>
                <AlertTitle>Title</AlertTitle>
                <AlertDescription>Description</AlertDescription>
                <AlertActions>
                  <AlertAction>Download</AlertAction>
                  <AlertAction>View</AlertAction>
                </AlertActions>
              </AlertContent>
              <AlertClose />
            </Alert>
          ))}
        </div>
      </div>
    );
  },
};
