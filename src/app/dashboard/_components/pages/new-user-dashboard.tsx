import Image from 'next/image';
import { OrgModal } from '@/app/dashboard/_components/modals/org-modal';

// Loading Skeleton Component
// const LoadingSkeleton = () => (
//   <div className="flex-1 animate-pulse">
//     <div className="h-full flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-800 rounded-xl p-4 sm:p-6 md:p-10">
//       <div className="w-[100px] h-[100px] sm:w-[125px] sm:h-[125px] md:w-[150px] md:h-[150px] bg-gray-300 dark:bg-gray-700 rounded-full" />
//       <div className="h-6 sm:h-8 w-36 sm:w-48 bg-gray-300 dark:bg-gray-700 rounded mt-4 sm:mt-6" />
//       <div className="h-3 sm:h-4 w-48 sm:w-64 bg-gray-300 dark:bg-gray-700 rounded mt-2" />
//       <div className="h-3 sm:h-4 w-48 sm:w-64 bg-gray-300 dark:bg-gray-700 rounded mt-2" />
//     </div>
//   </div>
// );

const NewUserDashBoardPage = () => {
  return (
    <>
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900">
        <Image
          src="/assets/img/organization/elements.svg"
          alt="Welcome"
          width={250}
          height={250}
          className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px] object-contain"
          priority
        />
        <h2 className="text-xl sm:text-md md:text-md font-bold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4 animate-fade-in text-center">
          Welcome to VisionArc
        </h2>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 text-center max-w-lg leading-relaxed px-4">
          Get started with your personalized dashboard experience
        </p>
        <OrgModal/>
      </div>
    </>
  );
};

export default NewUserDashBoardPage;
