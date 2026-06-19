import { MOCK_COURSE_SUGGESTIONS } from "./course-suggestions-data";
import { filterCourseSuggestions } from "./filter-course-suggestions";

describe("filterCourseSuggestions", () => {
  it("filters courses by category", () => {
    const result = filterCourseSuggestions(MOCK_COURSE_SUGGESTIONS, {
      search: "",
      category: "React",
      bookmarkedOnly: false,
      bookmarkedIds: new Set(),
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.title).toContain("React");
  });

  it("filters bookmarked courses only", () => {
    const result = filterCourseSuggestions(MOCK_COURSE_SUGGESTIONS, {
      search: "",
      category: "All",
      bookmarkedOnly: true,
      bookmarkedIds: new Set(["course-1", "course-6"]),
    });

    expect(result).toHaveLength(2);
    expect(result.map((course) => course.id)).toEqual(["course-1", "course-6"]);
  });

  it("filters courses by search keyword", () => {
    const result = filterCourseSuggestions(MOCK_COURSE_SUGGESTIONS, {
      search: "animation",
      category: "All",
      bookmarkedOnly: false,
      bookmarkedIds: new Set(),
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.title).toContain("Animation");
  });
});
