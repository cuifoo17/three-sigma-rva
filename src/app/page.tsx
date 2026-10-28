import BookScreen from "@/components/screens/BookScreen";
import EnrollScreen from "@/components/screens/EnrollScreen";
import HeroVideo from "@/components/screens/HeroVideo";
import OutcomesScreen from "@/components/screens/OutcomesScreen";
import TeacherScreen from "@/components/screens/TeacherScreen";
import Screen from "@/components/screens/Screen";

// Same copy as the deck, same snap, but the website's flat colour blocks
// instead of glass cards on a blurred hero.

// Dormant hero (2026-10-27): the page opens on "About the teacher". Flip to
// true to bring the video hero back as the first screen.
const SHOW_HERO = false;

export default function Screens() {
  return (
    <div data-deck>
      {/* 1. Hero (dormant, see SHOW_HERO) */}
      {/* fill={false}: on short phones the full-width video is taller than
          one screen, so this card grows and snaps at its top. */}
      {SHOW_HERO && (
        <Screen name="hero" tone="cream" fill={false}>
          <HeroVideo />
        </Screen>
      )}

      {/* 2. What they'll walk away with + course contents. First screen
          since 2026-10-27 (see OutcomesScreen). */}
      {/* Fixed height like the other screens: a min-height section relayouts
          when Safari's toolbar collapses mid-swipe, which stuttered the
          entrance. The smaller art fits one screen now. */}
      <Screen id="learn" name="outcomes" tone="sky">
        <OutcomesScreen />
      </Screen>

      {/* 3. About the teacher (see TeacherScreen). */}
      <Screen id="about" name="teacher" tone="white">
        <TeacherScreen />
      </Screen>

      {/* 4. Now enrolling: cohort table plus a short FAQ (see EnrollScreen).
          fill={false}: table plus five lines can run past a short phone. */}
      <Screen id="logistics" name="enroll" tone="navy" fill={false}>
        <EnrollScreen />
      </Screen>

      {/* 5. Book a free call; sending twists the section like a Rubik's
          cube onto the thank-you (see BookScreen). */}
      <BookScreen />
    </div>
  );
}
