import BookScreen from "@/components/screens/BookScreen";
import EnrollScreen from "@/components/screens/EnrollScreen";
import FitScreen from "@/components/screens/FitScreen";
import HeroVideo from "@/components/screens/HeroVideo";
import OutcomesScreen from "@/components/screens/OutcomesScreen";
import TeacherScreen from "@/components/screens/TeacherScreen";
import Screen from "@/components/screens/Screen";

// Same copy as the deck, same snap, but the website's flat colour blocks
// instead of glass cards on a blurred hero.
export default function Screens() {
  return (
    <div data-deck>
      {/* 1. Hero */}
      {/* fill={false}: on short phones the full-width video is taller than
          one screen, so this card grows and snaps at its top. */}
      <Screen tone="cream" fill={false}>
        <HeroVideo />
      </Screen>

      {/* 2. About the teacher: title, photo, bullets animate in on a timed
          sequence (see TeacherScreen). */}
      <Screen id="about" tone="white">
        <TeacherScreen />
      </Screen>

      {/* 3. What they'll walk away with: title, art, cards animate in on a
          timed sequence (see OutcomesScreen). */}
      {/* Fixed height like the other screens: a min-height section relayouts
          when Safari's toolbar collapses mid-swipe, which stuttered the
          entrance. The smaller art fits one screen now. */}
      <Screen id="learn" tone="sky">
        <OutcomesScreen />
      </Screen>

      {/* 4. Is this right for your child? */}
      {/* Hero art plus a checklist, no pop-ups; every element animates into
          place on a timed sequence (see FitScreen). */}
      <Screen tone="white">
        <FitScreen />
      </Screen>

      {/* 5. Now enrolling: cohort table plus a short FAQ (see EnrollScreen).
          fill={false}: table plus five lines can run past a short phone. */}
      <Screen id="logistics" tone="navy" fill={false}>
        <EnrollScreen />
      </Screen>

      {/* 6. Book a free call; sending twists the section like a Rubik's
          cube onto the thank-you (see BookScreen). */}
      <BookScreen />
    </div>
  );
}
