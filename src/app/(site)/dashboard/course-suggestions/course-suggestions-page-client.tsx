"use client";

import { useMemo, useState } from "react";

import type { NavbarUser } from "@/components/common/navbar-client";

import { DashboardHeader } from "../components/dashboard-header";
import { DashboardPageContent } from "../components/dashboard-page-content";
import { CourseCategoryBar } from "./components/course-category-bar";
import { CourseSuggestionCard } from "./components/course-suggestion-card";
import { CourseSuggestionsToolbar } from "./components/course-suggestions-toolbar";
import {
  MOCK_COURSE_SUGGESTIONS,
  type CourseCategory,
} from "./lib/course-suggestions-data";
import { filterCourseSuggestions } from "./lib/filter-course-suggestions";

interface CourseSuggestionsPageClientProps {
  user: NavbarUser | null;
}

export function CourseSuggestionsPageClient({
  user,
}: CourseSuggestionsPageClientProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<CourseCategory>("All");
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(
    () => new Set()
  );

  const navbarUser: NavbarUser = user ?? {
    email: "guest@prismacv.app",
    name: "Guest",
  };

  const visibleCourses = useMemo(
    () =>
      filterCourseSuggestions(MOCK_COURSE_SUGGESTIONS, {
        search,
        category: activeCategory,
        bookmarkedOnly,
        bookmarkedIds,
      }),
    [search, activeCategory, bookmarkedOnly, bookmarkedIds]
  );

  function toggleBookmark(courseId: string) {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(courseId)) {
        next.delete(courseId);
      } else {
        next.add(courseId);
      }
      return next;
    });
  }

  return (
    <>
      <DashboardHeader
        user={navbarUser}
        title="Course Suggestion"
        subtitle="Courses grouped by skill area to close your gaps faster"
      />

      <DashboardPageContent cardClassName="flex flex-col gap-6">
        <CourseSuggestionsToolbar
          search={search}
          onSearchChange={setSearch}
          bookmarkedOnly={bookmarkedOnly}
          onBookmarkedOnlyChange={setBookmarkedOnly}
          bookmarkCount={bookmarkedIds.size}
        />

        <CourseCategoryBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {visibleCourses.length === 0 ? (
          <p className="py-12 text-center text-sm text-content-secondary">
            No courses match your filters. Try another category or clear
            bookmarks.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleCourses.map((course) => (
              <CourseSuggestionCard
                key={course.id}
                course={course}
                isBookmarked={bookmarkedIds.has(course.id)}
                onToggleBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}
      </DashboardPageContent>
    </>
  );
}
