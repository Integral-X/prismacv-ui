import { apiClient } from '@/shared/http/api-client';
import type { PaginatedResponse } from '@/shared/http/paginated-response';
import {
  getInterviewCategories,
  getInterviewQuestions,
  getInterviewRoles,
} from './queries';
import type { InterviewQuestionContract } from './contracts';

jest.mock('@/shared/http/api-client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

const getMock = jest.mocked(apiClient.get);

const questionContract: InterviewQuestionContract = {
  id: 'q_001',
  question: 'Explain event loop.',
  category: 'JavaScript',
  role: 'Frontend Engineer',
  difficulty: 'HARD',
};

function paginated(
  items: InterviewQuestionContract[]
): PaginatedResponse<InterviewQuestionContract> {
  return {
    data: items,
    meta: {
      total: items.length,
      page: 1,
      limit: 20,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  };
}

describe('interview queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getInterviewQuestions', () => {
    it('requests with empty params and maps the question list', async () => {
      getMock.mockResolvedValueOnce(paginated([questionContract]));

      const result = await getInterviewQuestions();

      expect(getMock).toHaveBeenCalledWith('interview/questions', {
        params: {},
      });
      expect(result[0].difficulty).toBe('hard');
    });

    it('forwards provided filters including the random flag', async () => {
      getMock.mockResolvedValueOnce(paginated([]));

      await getInterviewQuestions({
        role: 'Frontend Engineer',
        category: 'JavaScript',
        difficulty: 'HARD',
        random: true,
        limit: 5,
      });

      expect(getMock).toHaveBeenCalledWith('interview/questions', {
        params: {
          role: 'Frontend Engineer',
          category: 'JavaScript',
          difficulty: 'HARD',
          random: true,
          limit: 5,
        },
      });
    });

    it('omits the random flag when it is false', async () => {
      getMock.mockResolvedValueOnce(paginated([]));

      await getInterviewQuestions({ random: false });

      expect(getMock).toHaveBeenCalledWith('interview/questions', {
        params: {},
      });
    });
  });

  describe('getInterviewRoles', () => {
    it('returns the raw role list', async () => {
      getMock.mockResolvedValueOnce(['Frontend Engineer']);

      const result = await getInterviewRoles();

      expect(getMock).toHaveBeenCalledWith('interview/roles');
      expect(result).toEqual(['Frontend Engineer']);
    });
  });

  describe('getInterviewCategories', () => {
    it('returns the raw category list', async () => {
      getMock.mockResolvedValueOnce(['JavaScript', 'System Design']);

      const result = await getInterviewCategories();

      expect(getMock).toHaveBeenCalledWith('interview/categories');
      expect(result).toEqual(['JavaScript', 'System Design']);
    });
  });
});
