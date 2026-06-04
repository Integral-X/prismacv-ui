import { HttpError } from '@/shared/http/http-error';
import {
  deleteAccountAction,
  removeAvatarAction,
  updateProfileAction,
  uploadAvatarAction,
} from './actions';

jest.mock('@/modules/auth/data/session', () => ({
  clearAuthSession: jest.fn(),
}));

jest.mock('./mutations', () => ({
  updateProfile: jest.fn(),
  uploadAvatar: jest.fn(),
  deleteAccount: jest.fn(),
}));

const mutations = jest.requireMock('./mutations') as {
  updateProfile: jest.Mock;
  uploadAvatar: jest.Mock;
  deleteAccount: jest.Mock;
};

const { clearAuthSession } = jest.requireMock(
  '@/modules/auth/data/session'
) as {
  clearAuthSession: jest.Mock;
};

describe('user actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateProfileAction', () => {
    it('returns success when the profile updates', async () => {
      mutations.updateProfile.mockResolvedValueOnce({ id: 'user_1' });

      const result = await updateProfileAction({ name: 'Alex John' });

      expect(result).toEqual({
        ok: true,
        message: 'Profile updated successfully',
      });
      expect(mutations.updateProfile).toHaveBeenCalledWith({
        name: 'Alex John',
      });
    });

    it('maps HttpError to a failure result', async () => {
      mutations.updateProfile.mockRejectedValueOnce(
        new HttpError(401, 'Unauthorized', 'Session expired')
      );

      const result = await updateProfileAction({ name: 'Alex John' });

      expect(result).toEqual({
        ok: false,
        code: 'unauthorized',
        message: 'Session expired',
      });
    });
  });

  describe('uploadAvatarAction', () => {
    it('rejects when no file is provided', async () => {
      const formData = new FormData();

      const result = await uploadAvatarAction(formData);

      expect(result).toEqual({
        ok: false,
        code: 'unknown',
        message: 'Please choose an image to upload.',
      });
      expect(mutations.uploadAvatar).not.toHaveBeenCalled();
    });

    it('uploads the avatar and persists the returned url', async () => {
      mutations.uploadAvatar.mockResolvedValueOnce(
        'https://cdn.example.com/avatar.jpg'
      );
      mutations.updateProfile.mockResolvedValueOnce({ id: 'user_1' });

      const formData = new FormData();
      formData.append(
        'avatar',
        new File(['pixels'], 'avatar.png', {
          type: 'image/png',
        })
      );

      const result = await uploadAvatarAction(formData);

      expect(result).toEqual({
        ok: true,
        message: 'Profile photo updated successfully',
      });
      expect(mutations.uploadAvatar).toHaveBeenCalled();
      expect(mutations.updateProfile).toHaveBeenCalledWith({
        avatarUrl: 'https://cdn.example.com/avatar.jpg',
      });
    });
  });

  describe('removeAvatarAction', () => {
    it('clears the avatar url on the profile', async () => {
      mutations.updateProfile.mockResolvedValueOnce({ id: 'user_1' });

      const result = await removeAvatarAction();

      expect(result).toEqual({
        ok: true,
        message: 'Profile photo removed successfully',
      });
      expect(mutations.updateProfile).toHaveBeenCalledWith({ avatarUrl: '' });
    });
  });

  describe('deleteAccountAction', () => {
    it('deletes the account and clears the session', async () => {
      mutations.deleteAccount.mockResolvedValueOnce(undefined);
      clearAuthSession.mockResolvedValueOnce(undefined);

      const result = await deleteAccountAction();

      expect(result).toEqual({ ok: true, redirectTo: '/' });
      expect(mutations.deleteAccount).toHaveBeenCalled();
      expect(clearAuthSession).toHaveBeenCalled();
    });
  });
});
