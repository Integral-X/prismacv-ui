'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Plus,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  BarChart3,
  Trash2,
  ExternalLink,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { Job, JobStats } from '@/modules/jobs/data/mappers';
import { REVERSE_STATUS_MAP } from '@/modules/jobs/data/mappers';
import {
  createJobAction,
  deleteJobAction,
  updateJobStatusAction,
} from '@/modules/jobs/data/actions';
import {
  createJobSchema,
  type CreateJobFormData,
} from '@/lib/validations/jobs';

interface JobsPageClientProps {
  initialJobs: Job[];
  initialStats: JobStats;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  saved: {
    label: 'Saved',
    color: 'bg-surface-page text-content-secondary',
    icon: <Briefcase className='h-3 w-3' />,
  },
  applied: {
    label: 'Applied',
    color: 'bg-blue-100 text-blue-700',
    icon: <Clock className='h-3 w-3' />,
  },
  interview: {
    label: 'Interview',
    color: 'bg-yellow-100 text-yellow-700',
    icon: <MessageSquare className='h-3 w-3' />,
  },
  offer: {
    label: 'Offer',
    color: 'bg-green-100 text-green-700',
    icon: <CheckCircle className='h-3 w-3' />,
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-700',
    icon: <XCircle className='h-3 w-3' />,
  },
};

const STATUS_COLUMNS = [
  'saved',
  'applied',
  'interview',
  'offer',
  'rejected',
] as const;

export function JobsPageClient({
  initialJobs,
  initialStats,
}: JobsPageClientProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [stats, setStats] = useState<JobStats>(initialStats);
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('board');

  const {
    register,
    handleSubmit,
    setValue,
    reset: resetForm,
    formState: { errors },
  } = useForm<CreateJobFormData>({
    resolver: zodResolver(createJobSchema),
    defaultValues: { status: 'SAVED' },
  });

  function onSubmit(data: CreateJobFormData) {
    startTransition(async () => {
      const result = await createJobAction({
        title: data.title,
        company: data.company,
        url: data.url || undefined,
        location: data.location || undefined,
        status: data.status,
      });
      if (result.ok && result.data) {
        setJobs((prev) => [result.data!, ...prev]);
        setStats((prev) => ({ ...prev, total: prev.total + 1 }));
        setDialogOpen(false);
        resetForm();
        toast.success(result.message);
      } else if (!result.ok) {
        toast.error(result.message);
      }
    });
  }

  function handleStatusChange(jobId: string, newStatus: string) {
    const contractStatus =
      REVERSE_STATUS_MAP[newStatus as keyof typeof REVERSE_STATUS_MAP];

    if (!contractStatus) return;

    startTransition(async () => {
      const result = await updateJobStatusAction(jobId, {
        status: contractStatus,
      });
      if (result.ok && result.data) {
        setJobs((prev) => prev.map((j) => (j.id === jobId ? result.data! : j)));
        toast.success(result.message);
      } else if (!result.ok) {
        toast.error(result.message);
      }
    });
  }

  function handleDelete(jobId: string) {
    startTransition(async () => {
      const result = await deleteJobAction(jobId);
      if (result.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== jobId));
        setStats((prev) => ({ ...prev, total: prev.total - 1 }));
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <main className='container mx-auto py-8 px-4'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>Job Tracker</h1>
          <p className='text-muted-foreground mt-1'>
            Track your job applications in one place
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className='h-4 w-4 mr-2' />
              Add Job
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Job Application</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Job Title</Label>
                <Input
                  id='title'
                  placeholder='Software Engineer'
                  aria-invalid={!!errors.title}
                  {...register('title')}
                />
                {errors.title && (
                  <p role='alert' className='text-xs text-feedback-error'>
                    {errors.title.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='company'>Company</Label>
                <Input
                  id='company'
                  placeholder='Company name'
                  aria-invalid={!!errors.company}
                  {...register('company')}
                />
                {errors.company && (
                  <p role='alert' className='text-xs text-feedback-error'>
                    {errors.company.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='url'>Job URL</Label>
                <Input
                  id='url'
                  type='url'
                  placeholder='https://...'
                  aria-invalid={!!errors.url}
                  {...register('url')}
                />
                {errors.url && (
                  <p role='alert' className='text-xs text-feedback-error'>
                    {errors.url.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='location'>Location</Label>
                <Input
                  id='location'
                  placeholder='City, Country'
                  {...register('location')}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='status'>Status</Label>
                <Select
                  defaultValue='SAVED'
                  onValueChange={(v) =>
                    setValue('status', v as CreateJobFormData['status'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='SAVED'>Saved</SelectItem>
                    <SelectItem value='APPLIED'>Applied</SelectItem>
                    <SelectItem value='INTERVIEW'>Interview</SelectItem>
                    <SelectItem value='OFFER'>Offer</SelectItem>
                    <SelectItem value='REJECTED'>Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type='submit' className='w-full' disabled={isPending}>
                {isPending ? 'Adding...' : 'Add Job'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats cards */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-2'>
              <BarChart3 className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm text-muted-foreground'>Total</span>
            </div>
            <p className='text-2xl font-bold mt-1'>{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-2'>
              <Clock className='h-4 w-4 text-blue-500' />
              <span className='text-sm text-muted-foreground'>
                Applied This Week
              </span>
            </div>
            <p className='text-2xl font-bold mt-1'>{stats.appliedThisWeek}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-2'>
              <MessageSquare className='h-4 w-4 text-yellow-500' />
              <span className='text-sm text-muted-foreground'>Interviews</span>
            </div>
            <p className='text-2xl font-bold mt-1'>{stats.pendingInterviews}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center gap-2'>
              <CheckCircle className='h-4 w-4 text-green-500' />
              <span className='text-sm text-muted-foreground'>Offers</span>
            </div>
            <p className='text-2xl font-bold mt-1'>{stats.activeOffers}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className='mb-4'>
          <TabsTrigger value='board'>Board View</TabsTrigger>
          <TabsTrigger value='list'>List View</TabsTrigger>
        </TabsList>

        <TabsContent value='board'>
          <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
            {STATUS_COLUMNS.map((status) => {
              const config = STATUS_CONFIG[status];
              const columnJobs = jobs.filter((j) => j.status === status);

              return (
                <div key={status} className='space-y-3'>
                  <div className='flex items-center gap-2 px-2'>
                    {config.icon}
                    <span className='font-medium text-sm'>{config.label}</span>
                    <Badge variant='secondary' className='ml-auto'>
                      {columnJobs.length}
                    </Badge>
                  </div>
                  <div className='space-y-2 min-h-[200px]'>
                    {columnJobs.map((job) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                        isPending={isPending}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value='list'>
          <div className='space-y-2'>
            {jobs.length === 0 ? (
              <Card>
                <CardContent className='py-12 text-center text-muted-foreground'>
                  No jobs tracked yet. Add your first job application!
                </CardContent>
              </Card>
            ) : (
              jobs.map((job) => (
                <JobListItem
                  key={job.id}
                  job={job}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                  isPending={isPending}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

interface JobCardProps {
  job: Job;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}

function JobCard({ job, onStatusChange, onDelete, isPending }: JobCardProps) {
  return (
    <Card className='cursor-pointer hover:shadow-md transition-shadow'>
      <CardContent className='p-3 space-y-2'>
        <div className='flex items-start justify-between'>
          <div className='min-w-0'>
            <h3 className='font-medium text-sm truncate'>{job.title}</h3>
            <p className='text-xs text-muted-foreground truncate'>
              {job.company}
            </p>
          </div>
          <Button
            variant='ghost'
            size='icon'
            className='h-6 w-6 shrink-0'
            onClick={() => onDelete(job.id)}
            disabled={isPending}
          >
            <Trash2 className='h-3 w-3' />
          </Button>
        </div>
        {job.location && (
          <div className='flex items-center gap-1 text-xs text-muted-foreground'>
            <MapPin className='h-3 w-3' />
            <span className='truncate'>{job.location}</span>
          </div>
        )}
        {job.url && (
          <a
            href={job.url}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-1 text-xs text-blue-600 hover:underline'
          >
            <ExternalLink className='h-3 w-3' />
            View listing
          </a>
        )}
        <Select
          value={job.status}
          onValueChange={(v) => onStatusChange(job.id, v)}
          disabled={isPending}
        >
          <SelectTrigger className='h-7 text-xs'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='saved'>Saved</SelectItem>
            <SelectItem value='applied'>Applied</SelectItem>
            <SelectItem value='interview'>Interview</SelectItem>
            <SelectItem value='offer'>Offer</SelectItem>
            <SelectItem value='rejected'>Rejected</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}

interface JobListItemProps {
  job: Job;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}

function JobListItem({
  job,
  onStatusChange,
  onDelete,
  isPending,
}: JobListItemProps) {
  const config = STATUS_CONFIG[job.status];

  return (
    <Card>
      <CardContent className='flex items-center gap-4 py-3 px-4'>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2'>
            <h3 className='font-medium truncate'>{job.title}</h3>
            <Badge className={config.color} variant='secondary'>
              {config.label}
            </Badge>
          </div>
          <div className='flex items-center gap-3 text-sm text-muted-foreground mt-0.5'>
            <span>{job.company}</span>
            {job.location && (
              <span className='flex items-center gap-1'>
                <MapPin className='h-3 w-3' />
                {job.location}
              </span>
            )}
            {job.isRemote && <Badge variant='outline'>Remote</Badge>}
          </div>
        </div>
        <div className='flex items-center gap-2 shrink-0'>
          {job.url && (
            <Button variant='ghost' size='icon' asChild>
              <a href={job.url} target='_blank' rel='noopener noreferrer'>
                <ExternalLink className='h-4 w-4' />
              </a>
            </Button>
          )}
          <Select
            value={job.status}
            onValueChange={(v) => onStatusChange(job.id, v)}
            disabled={isPending}
          >
            <SelectTrigger className='w-[130px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='saved'>Saved</SelectItem>
              <SelectItem value='applied'>Applied</SelectItem>
              <SelectItem value='interview'>Interview</SelectItem>
              <SelectItem value='offer'>Offer</SelectItem>
              <SelectItem value='rejected'>Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => onDelete(job.id)}
            disabled={isPending}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
