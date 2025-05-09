
import { UspCanvasJob } from '../types';

// A simple test file to ensure types are working correctly
describe('AI Types', () => {
  it('should have the correct UspCanvasJob structure', () => {
    const job: UspCanvasJob = {
      id: '1',
      title: 'Test job',
      description: 'Test job description',
      priority: 'medium' // This was causing the error
    };

    expect(job.id).toBe('1');
    expect(job.title).toBe('Test job');
    expect(job.description).toBe('Test job description');
    expect(job.priority).toBe('medium');
  });
});

// Add more type tests as needed
export {};
