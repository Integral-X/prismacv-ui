import { joinDisplayName, splitDisplayName } from "@/lib/validations/user";

describe("display name helpers", () => {
  it("splits a full name into first and last parts", () => {
    expect(splitDisplayName("Alex John")).toEqual({
      firstName: "Alex",
      lastName: "John",
    });
  });

  it("returns empty parts when the name is missing", () => {
    expect(splitDisplayName(null)).toEqual({
      firstName: "",
      lastName: "",
    });
  });

  it("joins first and last names into a single display name", () => {
    expect(joinDisplayName("Alex", "John")).toBe("Alex John");
  });
});
