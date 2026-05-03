'use client';

import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Lightbulb,
  MessageCircle,
  Shuffle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

import type { InterviewQuestion } from '@/modules/interview/data/mappers';

interface InterviewPageClientProps {
  initialQuestions: InterviewQuestion[];
  roles: string[];
  categories: string[];
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hard: 'bg-red-100 text-red-700',
};

export function InterviewPageClient({
  initialQuestions,
  roles,
  categories,
}: InterviewPageClientProps) {
  const [questions] = useState<InterviewQuestion[]>(initialQuestions);
  const [filteredQuestions, setFilteredQuestions] =
    useState<InterviewQuestion[]>(initialQuestions);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  function applyFilters(role: string, category: string, difficulty: string) {
    let filtered = questions;
    if (role !== 'all') filtered = filtered.filter((q) => q.role === role);
    if (category !== 'all')
      filtered = filtered.filter((q) => q.category === category);
    if (difficulty !== 'all')
      filtered = filtered.filter((q) => q.difficulty === difficulty);
    setFilteredQuestions(filtered);
    setCurrentIndex(0);
  }

  function handleRoleChange(value: string) {
    setRoleFilter(value);
    applyFilters(value, categoryFilter, difficultyFilter);
  }

  function handleCategoryChange(value: string) {
    setCategoryFilter(value);
    applyFilters(roleFilter, value, difficultyFilter);
  }

  function handleDifficultyChange(value: string) {
    setDifficultyFilter(value);
    applyFilters(roleFilter, categoryFilter, value);
  }

  function shuffleQuestions() {
    const shuffled = [...filteredQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setFilteredQuestions(shuffled);
    setCurrentIndex(0);
  }

  return (
    <main className='container mx-auto py-8 px-4'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>Interview Prep</h1>
          <p className='text-muted-foreground mt-1'>
            Practice common interview questions for your target role
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            variant={practiceMode ? 'default' : 'outline'}
            onClick={() => {
              setPracticeMode(!practiceMode);
              setCurrentIndex(0);
            }}
          >
            <MessageCircle className='h-4 w-4 mr-2' />
            {practiceMode ? 'Exit Practice' : 'Practice Mode'}
          </Button>
          <Button variant='outline' onClick={shuffleQuestions}>
            <Shuffle className='h-4 w-4 mr-2' />
            Shuffle
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap gap-3 mb-6'>
        <div className='flex items-center gap-2'>
          <Filter className='h-4 w-4 text-muted-foreground' />
          <Select value={roleFilter} onValueChange={handleRoleChange}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Role' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Roles</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Select value={categoryFilter} onValueChange={handleCategoryChange}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={difficultyFilter} onValueChange={handleDifficultyChange}>
          <SelectTrigger className='w-[150px]'>
            <SelectValue placeholder='Difficulty' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Levels</SelectItem>
            <SelectItem value='easy'>Easy</SelectItem>
            <SelectItem value='medium'>Medium</SelectItem>
            <SelectItem value='hard'>Hard</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant='secondary' className='self-center'>
          {filteredQuestions.length} questions
        </Badge>
      </div>

      {/* Practice Mode */}
      {practiceMode && filteredQuestions.length > 0 ? (
        <PracticeCard
          question={filteredQuestions[currentIndex]}
          index={currentIndex}
          total={filteredQuestions.length}
          onNext={() =>
            setCurrentIndex((i) =>
              Math.min(i + 1, filteredQuestions.length - 1)
            )
          }
          onPrev={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
        />
      ) : (
        <div className='space-y-3'>
          {filteredQuestions.length === 0 ? (
            <Card>
              <CardContent className='py-12 text-center text-muted-foreground'>
                No questions match your filters. Try adjusting them.
              </CardContent>
            </Card>
          ) : (
            filteredQuestions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))
          )}
        </div>
      )}
    </main>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function QuestionCard({ question }: { question: InterviewQuestion }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className='cursor-pointer hover:bg-muted/50 transition-colors'>
            <div className='flex items-start justify-between gap-4'>
              <div className='space-y-1'>
                <CardTitle className='text-base leading-snug'>
                  {question.question}
                </CardTitle>
                <div className='flex items-center gap-2'>
                  <Badge variant='outline' className='text-xs'>
                    {question.role}
                  </Badge>
                  <Badge variant='secondary' className='text-xs'>
                    {question.category}
                  </Badge>
                  <Badge
                    className={`text-xs ${DIFFICULTY_COLORS[question.difficulty]}`}
                    variant='secondary'
                  >
                    {question.difficulty}
                  </Badge>
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className='h-4 w-4 shrink-0' />
              ) : (
                <ChevronDown className='h-4 w-4 shrink-0' />
              )}
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className='pt-0 space-y-3'>
            {question.sampleAnswer && (
              <div className='rounded-lg bg-muted p-3'>
                <p className='text-sm font-medium mb-1'>Sample Answer</p>
                <p className='text-sm text-muted-foreground'>
                  {question.sampleAnswer}
                </p>
              </div>
            )}
            {question.tips && (
              <div className='flex items-start gap-2 text-sm'>
                <Lightbulb className='h-4 w-4 text-yellow-500 mt-0.5 shrink-0' />
                <p className='text-muted-foreground'>{question.tips}</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}

interface PracticeCardProps {
  question: InterviewQuestion;
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}

function PracticeCard({
  question,
  index,
  total,
  onNext,
  onPrev,
}: PracticeCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <Card className='max-w-2xl mx-auto'>
      <CardHeader>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-sm text-muted-foreground'>
            Question {index + 1} of {total}
          </span>
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='text-xs'>
              {question.role}
            </Badge>
            <Badge
              className={`text-xs ${DIFFICULTY_COLORS[question.difficulty]}`}
              variant='secondary'
            >
              {question.difficulty}
            </Badge>
          </div>
        </div>
        <CardTitle className='text-lg'>{question.question}</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {showAnswer ? (
          <div className='space-y-3'>
            {question.sampleAnswer && (
              <div className='rounded-lg bg-muted p-4'>
                <p className='text-sm font-medium mb-1'>Sample Answer</p>
                <p className='text-sm'>{question.sampleAnswer}</p>
              </div>
            )}
            {question.tips && (
              <div className='flex items-start gap-2 text-sm'>
                <Lightbulb className='h-4 w-4 text-yellow-500 mt-0.5 shrink-0' />
                <p>{question.tips}</p>
              </div>
            )}
          </div>
        ) : (
          <Button
            variant='outline'
            className='w-full'
            onClick={() => setShowAnswer(true)}
          >
            Show Answer
          </Button>
        )}

        <div className='flex items-center justify-between pt-2'>
          <Button variant='outline' onClick={onPrev} disabled={index === 0}>
            Previous
          </Button>
          <Button
            onClick={() => {
              setShowAnswer(false);
              onNext();
            }}
            disabled={index === total - 1}
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
