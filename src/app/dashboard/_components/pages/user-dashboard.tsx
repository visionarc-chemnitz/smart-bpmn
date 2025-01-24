import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import Image from 'next/image';

const UserDashBoardPage = () => {
  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900">
        <Image
          src="/assets/img/organization/note.svg"
          alt="Welcome"
          width={250}
          height={250}
          className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] object-contain"
          priority
        />
        <h2 className="text-xl sm:text-md md:text-md font-bold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4 animate-fade-in text-center">
          Hello Visionaries!
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center max-w-lg leading-relaxed px-4">
          Start your journey with VisionArc
        </p>
        {/* <InteractiveHoverButton className='bg-black text-white' > Create Project </InteractiveHoverButton> */}
      </div>
    </>
  );
};

export default UserDashBoardPage;
