import type {
  OtpResendContract,
  OtpVerificationContract,
  UserAuthContract,
  UserLoginContract,
  UserProfileContract,
} from "./contracts";
import {
  parseUserProfileFromJson,
  toAuthResult,
  toOtpResendResult,
  toOtpVerificationResult,
  toSignupResult,
  toUserProfile,
} from "./mappers";

const regularUserContract: UserProfileContract = {
  id: "user_123",
  email: "candidate@example.com",
  name: "Candidate",
  role: "REGULAR",
  emailVerified: true,
  createdAt: "2026-04-23T10:00:00.000Z",
  updatedAt: "2026-04-23T11:00:00.000Z",
};

const adminUserContract: UserProfileContract = {
  ...regularUserContract,
  id: "admin_123",
  email: "admin@example.com",
  role: "PLATFORM_ADMIN",
};

describe("auth mappers", () => {
  it("maps regular backend user profiles into domain profiles", () => {
    expect(toUserProfile(regularUserContract)).toEqual({
      id: "user_123",
      email: "candidate@example.com",
      name: "Candidate",
      role: "regular",
      emailVerified: true,
      createdAt: new Date("2026-04-23T10:00:00.000Z"),
      updatedAt: new Date("2026-04-23T11:00:00.000Z"),
    });
  });

  it("maps platform admins into admin domain roles", () => {
    expect(toUserProfile(adminUserContract)).toMatchObject({
      id: "admin_123",
      role: "admin",
    });
  });

  it("maps auth and OTP response contracts", () => {
    const loginContract: UserLoginContract = {
      user: regularUserContract,
      accessToken: "access-token",
      refreshToken: "refresh-token",
    };
    const signupContract: UserAuthContract = {
      user: regularUserContract,
    };
    const otpContract: OtpVerificationContract = {
      message: "Verified",
      user: regularUserContract,
      accessToken: "otp-access-token",
      refreshToken: "otp-refresh-token",
    };
    const resendContract: OtpResendContract = {
      message: "OTP resent",
      expiresAt: "2026-04-23T12:00:00.000Z",
    };

    expect(toAuthResult(loginContract)).toMatchObject({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: {
        id: "user_123",
      },
    });
    expect(toSignupResult(signupContract)).toMatchObject({
      user: {
        id: "user_123",
      },
    });
    expect(toOtpVerificationResult(otpContract)).toMatchObject({
      message: "Verified",
      accessToken: "otp-access-token",
      refreshToken: "otp-refresh-token",
      user: {
        id: "user_123",
      },
    });
    expect(toOtpResendResult(resendContract)).toEqual({
      message: "OTP resent",
      expiresAt: new Date("2026-04-23T12:00:00.000Z"),
    });
  });

  it("restores a user profile from serialized cookie JSON", () => {
    const result = parseUserProfileFromJson({
      id: "user_123",
      email: "candidate@example.com",
      name: "Candidate",
      role: "PLATFORM_ADMIN",
      emailVerified: true,
      createdAt: "2026-04-23T10:00:00.000Z",
      updatedAt: "2026-04-23T11:00:00.000Z",
    });

    expect(result).toEqual({
      id: "user_123",
      email: "candidate@example.com",
      name: "Candidate",
      role: "admin",
      emailVerified: true,
      createdAt: new Date("2026-04-23T10:00:00.000Z"),
      updatedAt: new Date("2026-04-23T11:00:00.000Z"),
    });
  });

  it("returns null when serialized cookie JSON is not a valid user profile", () => {
    expect(parseUserProfileFromJson(null)).toBeNull();
    expect(parseUserProfileFromJson({ id: "user_123" })).toBeNull();
    expect(
      parseUserProfileFromJson({
        id: "user_123",
        email: "candidate@example.com",
        role: "regular",
        emailVerified: true,
        createdAt: "not-a-date",
        updatedAt: "2026-04-23T11:00:00.000Z",
      })
    ).toBeNull();
  });
});
