import type {
  CourseCategory,
  CourseSuggestion,
} from "./course-suggestions-data";

export function filterCourseSuggestions(
  courses: CourseSuggestion[],
  options: {
    search: string;
    category: CourseCategory;
    bookmarkedOnly: boolean;
    bookmarkedIds: Set<string>;
  }
): CourseSuggestion[] {
  const query = options.search.trim().toLowerCase();

  return courses.filter((course) => {
    if (options.bookmarkedOnly && !options.bookmarkedIds.has(course.id)) {
      return false;
    }

    if (
      options.category !== "All" &&
      !course.categories.includes(options.category)
    ) {
      return false;
    }

    if (query.length === 0) return true;

    const haystack = [
      course.title,
      course.author,
      course.platform,
      ...course.categories,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}
