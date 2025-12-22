import {argosScreenshot} from '@argos-ci/storybook/vitest';
import {zodResolver} from '@hookform/resolvers/zod';
import type {Meta, StoryObj} from '@storybook/react';
import {Button} from 'components/button';
import {Checkbox, CheckboxLabel, CheckboxLinks} from 'components/checkbox';
import {Input} from 'components/input';
import {Textarea} from 'components/textarea';
import {Code, Header} from 'components/typography';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';

const meta = {
  title: 'Components/Form',
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const basicFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
});

type BasicFormValues = z.infer<typeof basicFormSchema>;

function BasicFormExample() {
  const form = useForm<BasicFormValues>({
    resolver: zodResolver(basicFormSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  });

  function onSubmit(data: BasicFormValues) {
    // biome-ignore lint/suspicious/noConsole: <we need to log the data for the story>
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-md">
        <FormField
          control={form.control}
          name="username"
          render={({field}) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@example.com" {...field} />
              </FormControl>
              <FormDescription>We'll never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const Basic: Story = {
  render: () => <BasicFormExample />,
  play: async (context) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    await argosScreenshot(context, 'Form Basic');
  },
};

const componentsFormSchema = z.object({
  example: z.string().min(1, 'This field is required'),
  exampleTextarea: z.string().min(1, 'This field is required'),
});

type ComponentsFormValues = z.infer<typeof componentsFormSchema>;

function FormComponentsExample() {
  const form = useForm<ComponentsFormValues>({
    resolver: zodResolver(componentsFormSchema),
    defaultValues: {
      example: '',
      exampleTextarea: '',
    },
  });

  return (
    <Form {...form}>
      <div className="flex flex-col gap-32 w-full max-w-md">
        <div className="flex flex-col gap-16">
          <Header variant="h3">Form Components</Header>
          <Code variant="label" className="text-foreground-neutral-subtle">
            Individual form components work together within FormField
          </Code>
        </div>

        <form className="space-y-8">
          <FormField
            control={form.control}
            name="example"
            render={({field}) => (
              <FormItem>
                <FormLabel>Form Label</FormLabel>
                <FormControl>
                  <Input placeholder="Form Control with Input" {...field} />
                </FormControl>
                <FormDescription>This is a form description.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exampleTextarea"
            render={({field}) => (
              <FormItem>
                <FormLabel>Form Label</FormLabel>
                <FormControl>
                  <Textarea placeholder="Form Control with Textarea" {...field} />
                </FormControl>
                <FormDescription>This is a form description.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </div>
    </Form>
  );
}

export const Components: Story = {
  render: () => <FormComponentsExample />,
};

const checkboxFormSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  newsletter: z.boolean(),
  notifications: z.boolean(),
});

type CheckboxFormValues = z.infer<typeof checkboxFormSchema>;

function FormWithCheckboxExample() {
  const form = useForm<CheckboxFormValues>({
    resolver: zodResolver(checkboxFormSchema),
    defaultValues: {
      username: '',
      email: '',
      newsletter: false,
      notifications: false,
    },
  });

  function onSubmit(data: CheckboxFormValues) {
    // biome-ignore lint/suspicious/noConsole: <we need to log the data for the story>
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-md">
        <FormField
          control={form.control}
          name="username"
          render={({field}) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@example.com" {...field} />
              </FormControl>
              <FormDescription>We'll never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newsletter"
          render={({field}) => (
            <FormItem className="flex flex-row items-center gap-8 pt-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Subscribe to newsletter</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notifications"
          render={({field}) => (
            <FormItem className="flex flex-row items-center gap-8 pt-4 pb-8">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Enable notifications</FormLabel>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const WithCheckbox: Story = {
  render: () => <FormWithCheckboxExample />,
};

const checkboxLabelSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  marketing: z.boolean(),
});

type CheckboxLabelFormValues = z.infer<typeof checkboxLabelSchema>;

function FormWithCheckboxLabelExample() {
  const form = useForm<CheckboxLabelFormValues>({
    resolver: zodResolver(checkboxLabelSchema),
    defaultValues: {
      username: '',
      email: '',
      terms: false,
      marketing: false,
    },
  });

  function onSubmit(data: CheckboxLabelFormValues) {
    // biome-ignore lint/suspicious/noConsole: <we need to log the data for the story>
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-md">
        <FormField
          control={form.control}
          name="username"
          render={({field}) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="terms"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <CheckboxLabel
                  label="I agree to the terms and conditions"
                  description="By checking this box, you agree to our terms of service and privacy policy."
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="marketing"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <CheckboxLabel
                  label="I want to receive marketing emails"
                  description="Stay updated with our latest products and offers."
                  optional
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const WithCheckboxLabel: Story = {
  render: () => <FormWithCheckboxLabelExample />,
};

const checkboxLinksSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  acceptPolicies: z.boolean().refine((val) => val === true, {
    message: 'You must accept the policies to continue',
  }),
});

type CheckboxLinksFormValues = z.infer<typeof checkboxLinksSchema>;

function FormWithCheckboxLinksExample() {
  const form = useForm<CheckboxLinksFormValues>({
    resolver: zodResolver(checkboxLinksSchema),
    defaultValues: {
      username: '',
      email: '',
      acceptPolicies: false,
    },
  });

  function onSubmit(data: CheckboxLinksFormValues) {
    // biome-ignore lint/suspicious/noConsole: <we need to log the data for the story>
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-md">
        <FormField
          control={form.control}
          name="username"
          render={({field}) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="acceptPolicies"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <CheckboxLinks
                  label="Accept policies"
                  links={[
                    {label: 'Terms of use', href: '#'},
                    {label: 'Privacy Policy', href: '#'},
                  ]}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export const WithCheckboxLinks: Story = {
  render: () => <FormWithCheckboxLinksExample />,
};

const checkboxLabelBorderSchema = z.object({
  plan: z.string().min(1, 'Plan name is required'),
  newsletter: z.boolean(),
});

type CheckboxLabelBorderFormValues = z.infer<typeof checkboxLabelBorderSchema>;

function FormWithCheckboxLabelBorderExample() {
  const form = useForm<CheckboxLabelBorderFormValues>({
    resolver: zodResolver(checkboxLabelBorderSchema),
    defaultValues: {
      plan: '',
      newsletter: false,
    },
  });

  function onSubmit(data: CheckboxLabelBorderFormValues) {
    // biome-ignore lint/suspicious/noConsole: <we need to log the data for the story>
    console.log(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-md">
        <FormField
          control={form.control}
          name="plan"
          render={({field}) => (
            <FormItem>
              <FormLabel>Select a plan</FormLabel>
              <FormControl>
                <Input placeholder="Enter plan name" {...field} />
              </FormControl>
              <FormDescription>Choose the plan that best fits your needs.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newsletter"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <CheckboxLabel
                  label="Subscribe to our newsletter"
                  description="Get weekly updates, tips, and exclusive content delivered to your inbox."
                  optional
                  showInfoIcon
                  border
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export const WithCheckboxLabelBorder: Story = {
  render: () => <FormWithCheckboxLabelBorderExample />,
};
