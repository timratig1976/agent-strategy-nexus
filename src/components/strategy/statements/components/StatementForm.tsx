
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { StatementFormValues } from '../types';

interface StatementFormProps {
  onSubmit: (values: StatementFormValues) => void;
  placeholder?: string;
}

const StatementForm: React.FC<StatementFormProps> = ({
  onSubmit,
  placeholder = 'Enter statement content...'
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
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          rules={{ required: "Statement content is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statement Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={placeholder} 
                  className="resize-none" 
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="impact"
          rules={{ required: "Impact level is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Impact Level</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select impact level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low Impact</SelectItem>
                  <SelectItem value="medium">Medium Impact</SelectItem>
                  <SelectItem value="high">High Impact</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Statement
        </Button>
      </form>
    </Form>
  );
};

export default StatementForm;
