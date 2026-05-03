'use client';

import { useState, useTransition } from 'react';
import { BarChart3, BookOpen, Target, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

import type {
  SkillGapResult,
  SkillCategory,
} from '@/modules/skills/data/mappers';
import { assessSkillsAction } from '@/modules/skills/data/actions';

interface SkillsPageClientProps {
  categories: SkillCategory[];
  roles: string[];
}

interface SkillInput {
  name: string;
  level: number;
}

export function SkillsPageClient({ categories, roles }: SkillsPageClientProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [skillInputs, setSkillInputs] = useState<SkillInput[]>([
    { name: '', level: 50 },
  ]);
  const [assessment, setAssessment] = useState<SkillGapResult | null>(null);

  function addSkillInput() {
    setSkillInputs((prev) => [...prev, { name: '', level: 50 }]);
  }

  function updateSkillInput(
    index: number,
    field: 'name' | 'level',
    value: string | number
  ) {
    setSkillInputs((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  function removeSkillInput(index: number) {
    setSkillInputs((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAssess() {
    if (!selectedRole) {
      toast.error('Please select a target role.');
      return;
    }

    const validSkills = skillInputs
      .filter((s) => s.name.trim())
      .map((s) => s.name.trim());
    if (validSkills.length === 0) {
      toast.error('Please add at least one skill.');
      return;
    }

    startTransition(async () => {
      const result = await assessSkillsAction({
        targetRole: selectedRole,
        currentSkills: validSkills,
      });
      if (result.ok && result.data) {
        setAssessment(result.data);
      } else if (!result.ok) {
        toast.error(result.message);
      }
    });
  }

  return (
    <main className='container mx-auto py-8 px-4'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Skills Analysis</h1>
        <p className='text-muted-foreground mt-1'>
          Assess your skills and discover career growth paths
        </p>
      </div>

      {/* Categories overview */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-3 mb-8'>
        {categories.slice(0, 10).map((cat) => (
          <Card key={cat.id}>
            <CardContent className='pt-4 pb-3 px-4'>
              <p className='font-medium text-sm'>{cat.name}</p>
              {cat.description && (
                <p className='text-xs text-muted-foreground mt-0.5'>
                  {cat.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Assessment form */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Target className='h-5 w-5' />
              Skill Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <Label>Target Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder='Select a role' />
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

            <div className='space-y-3'>
              <Label>Your Skills</Label>
              {skillInputs.map((skill, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <Input
                    placeholder='Skill name'
                    value={skill.name}
                    onChange={(e) =>
                      updateSkillInput(index, 'name', e.target.value)
                    }
                    className='flex-1'
                  />
                  <div className='w-24 flex items-center gap-1'>
                    <Slider
                      value={[skill.level]}
                      onValueChange={([v]) =>
                        updateSkillInput(index, 'level', v)
                      }
                      max={100}
                      step={5}
                    />
                    <span className='text-xs w-8 text-right'>
                      {skill.level}
                    </span>
                  </div>
                  {skillInputs.length > 1 && (
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => removeSkillInput(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button variant='outline' size='sm' onClick={addSkillInput}>
                + Add Skill
              </Button>
            </div>

            <Button
              className='w-full'
              onClick={handleAssess}
              disabled={isPending}
            >
              {isPending ? 'Analyzing...' : 'Assess Skills'}
            </Button>
          </CardContent>
        </Card>

        {/* Assessment results */}
        <div className='space-y-4'>
          {assessment ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <BarChart3 className='h-5 w-5' />
                    Readiness Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-muted-foreground'>
                        {assessment.targetRole}
                      </span>
                      <span className='text-2xl font-bold'>
                        {assessment.overallReadiness}%
                      </span>
                    </div>
                    <Progress value={assessment.overallReadiness} />
                  </div>
                </CardContent>
              </Card>

              {assessment.strengths.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <TrendingUp className='h-5 w-5' />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-wrap gap-2'>
                      {assessment.strengths.map((strength) => (
                        <Badge key={strength} variant='secondary'>
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {assessment.gaps.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <BookOpen className='h-5 w-5' />
                      Gaps to Fill
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-wrap gap-2'>
                      {assessment.gaps.map((gap) => (
                        <Badge
                          key={gap}
                          variant='outline'
                          className='text-feedback-error'
                        >
                          {gap}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className='py-12 text-center text-muted-foreground'>
                <BookOpen className='h-12 w-12 mx-auto mb-4 opacity-50' />
                <p>
                  Enter your skills and select a target role to see your
                  assessment.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
