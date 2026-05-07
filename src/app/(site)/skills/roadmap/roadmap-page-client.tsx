'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Loader2,
  Map,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type {
  LearningRoadmap,
  UserSkillProgress,
} from '@/modules/skills/data/mappers';
import {
  fetchRoadmapAction,
  updateSkillProgressAction,
} from '@/modules/skills/data/actions';

interface RoadmapPageClientProps {
  roles: string[];
  initialProgress: UserSkillProgress[];
}

export function RoadmapPageClient({
  roles,
  initialProgress,
}: RoadmapPageClientProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState('');
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [progress, setProgress] = useState(initialProgress);

  function handleLoadRoadmap(role: string) {
    setSelectedRole(role);
    const requestedRole = role;
    startTransition(async () => {
      const result = await fetchRoadmapAction(requestedRole);
      if (result.ok && result.data) {
        // Only apply if this is still the selected role (guard against race)
        setSelectedRole((current) => {
          if (current === requestedRole) setRoadmap(result.data!);
          return current;
        });
      } else if (!result.ok) {
        toast.error(result.message);
      }
    });
  }

  function handleMarkComplete(skillName: string) {
    startTransition(async () => {
      const result = await updateSkillProgressAction({
        skillName,
        level: 100,
        status: 'completed',
      });
      if (result.ok && result.data) {
        setProgress((prev) => {
          const existing = prev.findIndex((p) => p.skillName === skillName);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = result.data!;
            return updated;
          }
          return [...prev, result.data!];
        });
        toast.success(`${skillName} marked as completed`);
      } else if (!result.ok) {
        toast.error(result.message);
      }
    });
  }

  function getSkillStatus(skillName: string): string {
    const p = progress.find((sp) => sp.skillName === skillName);
    return p?.status ?? 'not_started';
  }

  const completionPercent =
    roadmap && roadmap.totalSkills > 0
      ? Math.round((roadmap.completedSkills / roadmap.totalSkills) * 100)
      : 0;

  return (
    <div className='min-h-screen bg-surface-primary'>
      <div className='mx-auto max-w-5xl px-4 py-8'>
        {/* Header */}
        <div className='mb-6 flex items-center gap-3'>
          <Button
            variant='ghost'
            size='icon'
            aria-label='Back to skills'
            asChild
          >
            <Link href='/skills'>
              <ArrowLeft className='size-4' />
            </Link>
          </Button>
          <div className='flex-1'>
            <h1 className='text-2xl font-bold text-content-primary'>
              Learning Roadmap
            </h1>
            <p className='text-sm text-content-secondary'>
              Track your skill development journey
            </p>
          </div>
        </div>

        {/* Role selector */}
        <Card className='mb-6'>
          <CardContent className='flex items-center gap-4 pt-6'>
            <Map className='size-5 text-content-secondary' />
            <div className='flex-1'>
              <Select value={selectedRole} onValueChange={handleLoadRoadmap}>
                <SelectTrigger>
                  <SelectValue placeholder='Select a target role...' />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isPending && <Loader2 className='size-4 animate-spin' />}
          </CardContent>
        </Card>

        {/* Progress overview */}
        {roadmap && (
          <>
            <Card className='mb-6'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <TrendingUp className='size-5' />
                  Overall Progress — {roadmap.targetRole}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between text-sm'>
                  <span className='text-content-secondary'>
                    {roadmap.completedSkills} of {roadmap.totalSkills} skills
                    completed
                  </span>
                  <span className='font-semibold'>{completionPercent}%</span>
                </div>
                <Progress value={completionPercent} className='mt-2' />
              </CardContent>
            </Card>

            {/* Milestones */}
            <div className='space-y-6'>
              {roadmap.milestones.map((milestone, idx) => (
                <Card key={milestone.phase}>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <Badge variant='outline' className='text-xs'>
                        Phase {idx + 1}
                      </Badge>
                      {milestone.phase}
                    </CardTitle>
                    <p className='text-sm text-content-secondary'>
                      {milestone.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      {milestone.skills.map((skill) => {
                        const status = getSkillStatus(skill.skillName);
                        const isCompleted = status === 'completed';

                        return (
                          <div
                            key={skill.skillName}
                            className='flex items-center gap-3 rounded-md border border-border-subtle p-3'
                          >
                            {isCompleted ? (
                              <CheckCircle2 className='size-5 text-feedback-success' />
                            ) : (
                              <Circle className='size-5 text-content-tertiary' />
                            )}
                            <div className='flex-1'>
                              <p className='text-sm font-medium text-content-primary'>
                                {skill.skillName}
                              </p>
                              <div className='mt-1 flex items-center gap-2'>
                                <Progress
                                  value={skill.level}
                                  className='h-1.5 flex-1'
                                />
                                <span className='text-xs text-content-tertiary'>
                                  {skill.level}%
                                </span>
                              </div>
                            </div>
                            <Badge variant='secondary' className='text-xs'>
                              Importance: {skill.importance}/5
                            </Badge>
                            {!isCompleted && (
                              <Button
                                variant='ghost'
                                size='sm'
                                onClick={() =>
                                  handleMarkComplete(skill.skillName)
                                }
                                disabled={isPending}
                              >
                                Complete
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {!roadmap && !isPending && (
          <Card>
            <CardContent className='py-12 text-center'>
              <Map className='mx-auto mb-4 size-12 text-content-tertiary opacity-50' />
              <p className='text-content-secondary'>
                Select a target role to generate your learning roadmap.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Progress list */}
        {progress.length > 0 && (
          <Card className='mt-8'>
            <CardHeader>
              <CardTitle>Your Skill Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
                {progress.map((p) => (
                  <div
                    key={p.id}
                    className='flex items-center gap-2 rounded-md border border-border-subtle p-2'
                  >
                    {p.status === 'completed' ? (
                      <CheckCircle2 className='size-4 text-feedback-success' />
                    ) : (
                      <Circle className='size-4 text-content-tertiary' />
                    )}
                    <span className='flex-1 text-sm'>{p.skillName}</span>
                    <span className='text-xs text-content-tertiary'>
                      {p.level}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
