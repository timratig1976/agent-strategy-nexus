
import React from 'react';
import { useForm } from 'react-hook-form';
import { 
  Card,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatementFormValues } from '../types';

interface StatementFormProps {
  onSubmit: (values: StatementFormValues) => void;
  isSubmitting?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

const StatementForm: React.FC<StatementFormProps> = ({
  onSubmit,
  isSubmitting = false,
  placeholder = "Enter a statement...",
  autoFocus = false
}) => {
  const form = useForm<StatementFormValues>({
    defaultValues: {
      content: '',
      impact: 'medium'
    }
  });

  const handleSubmit = (values: StatementFormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card className="border-dashed border-gray-300">
          <CardContent className="pt-4">
            <FormField
              control={form.control}
              name="content"
              rules={{ required: "Statement text is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={placeholder}
                      className="min-h-24 resize-none"
                      autoFocus={autoFocus}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between gap-2 bg-gray-50">
            <FormField
              control={form.control}
              name="impact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs text-gray-500">Impact Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="Impact" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              Add Statement
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default StatementForm;
