
import React, { useState } from 'react';
import { TabbedContent } from '@/components/ui/tabbed-content';
import { ComponentContainer } from '@/components/ui/component-container';
import { DataList, DataListHeader, DataListItem, DataListEmpty, DataListFooter } from '@/components/ui/data-list';
import { ContentCard } from '@/components/ui/content-card';
import { StatusIndicator } from '@/components/ui/status-indicator';
import { CollapsiblePanel } from '@/components/ui/collapsible-panel';
import { FormField } from '@/components/ui/form-field';
import { useToggle } from '@/hooks/useToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Info, 
  AlignLeft, 
  Layers, 
  Users, 
  ChevronRight
} from 'lucide-react';

interface SampleItem {
  id: string;
  title: string;
  description: string;
  status: 'success' | 'warning' | 'error' | 'info' | 'pending';
}

const sampleData: SampleItem[] = [
  {
    id: '1',
    title: 'First Item',
    description: 'This is the first item description',
    status: 'success'
  },
  {
    id: '2',
    title: 'Second Item',
    description: 'This is the second item description',
    status: 'warning'
  },
  {
    id: '3',
    title: 'Third Item',
    description: 'This is the third item description',
    status: 'pending'
  }
];

const StandardizedModuleExample: React.FC = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [isToggled, toggle] = useToggle(false);
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <ComponentContainer
        title="Standardized Component Example"
        description="This example demonstrates the standardized components in action"
        headerActions={
          <Button onClick={toggle}>
            {isToggled ? 'Hide Details' : 'Show Details'}
          </Button>
        }
      >
        <TabbedContent
          tabs={[
            {
              id: 'list',
              label: 'Data List',
              content: (
                <DataList
                  items={sampleData}
                  keyExtractor={(item) => item.id}
                  header={
                    <DataListHeader
                      title="Sample Items"
                      description="This is an example of the DataList component"
                      actions={
                        <Button size="sm">Add New</Button>
                      }
                    />
                  }
                  renderItem={(item) => (
                    <DataListItem>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <StatusIndicator status={item.status} text={item.status} />
                      </div>
                    </DataListItem>
                  )}
                  footer={
                    <DataListFooter>
                      <Button variant="outline" size="sm">Previous</Button>
                      <Button variant="outline" size="sm">Next</Button>
                    </DataListFooter>
                  }
                />
              ),
              count: sampleData.length
            },
            {
              id: 'cards',
              label: 'Content Cards',
              content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sampleData.map(item => (
                    <ContentCard
                      key={item.id}
                      title={item.title}
                      icon={<FileText className="h-4 w-4" />}
                      footer={
                        <div className="flex justify-between items-center w-full">
                          <StatusIndicator status={item.status} size="sm" />
                          <Button variant="ghost" size="sm">
                            Details <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      }
                    >
                      <p className="text-sm">{item.description}</p>
                    </ContentCard>
                  ))}
                </div>
              ),
              count: sampleData.length
            },
            {
              id: 'panels',
              label: 'Collapsible Panels',
              content: (
                <div className="space-y-4">
                  <CollapsiblePanel
                    title="First Panel"
                    icon={<Info className="h-4 w-4" />}
                    defaultExpanded
                  >
                    <p className="text-sm">This is content for the first collapsible panel.</p>
                  </CollapsiblePanel>
                  
                  <CollapsiblePanel
                    title="Second Panel"
                    icon={<AlignLeft className="h-4 w-4" />}
                  >
                    <p className="text-sm">This is content for the second collapsible panel.</p>
                  </CollapsiblePanel>
                  
                  <CollapsiblePanel
                    title="Third Panel"
                    icon={<Layers className="h-4 w-4" />}
                  >
                    <p className="text-sm">This is content for the third collapsible panel.</p>
                  </CollapsiblePanel>
                </div>
              )
            },
            {
              id: 'form',
              label: 'Form Fields',
              content: (
                <div className="space-y-4 max-w-lg mx-auto">
                  <FormField 
                    id="name" 
                    label="Full Name" 
                    required
                  >
                    <Input id="name" placeholder="Enter your full name" />
                  </FormField>
                  
                  <FormField 
                    id="email" 
                    label="Email Address" 
                    description="We'll never share your email with anyone else."
                    required
                  >
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </FormField>
                  
                  <FormField 
                    id="username" 
                    label="Username" 
                    error="Username is already taken"
                  >
                    <Input id="username" placeholder="Choose a username" />
                  </FormField>
                  
                  <div className="flex justify-end">
                    <Button>Submit</Button>
                  </div>
                </div>
              )
            }
          ]}
          activeTabId={activeTab}
          onTabChange={setActiveTab}
        />
        
        {isToggled && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-dashed">
            <h4 className="font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Additional Details
            </h4>
            <p className="text-sm mt-2 text-muted-foreground">
              This section appears conditionally using the useToggle hook when you click the "Show Details" button.
              It demonstrates how components can be shown/hidden with state management.
            </p>
          </div>
        )}
      </ComponentContainer>
    </div>
  );
};

export default StandardizedModuleExample;
