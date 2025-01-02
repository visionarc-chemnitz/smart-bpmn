'use client'
import { FaFileAlt, FaImage, FaRobot } from 'react-icons/fa'

export default function TeamSpacePage() {
    return (
        <>
            <div className="flex flex-1 flex-col gap-6 p-6 pt-4 bg-gray-200 dark:bg-gray-800 rounded-xl">
                {/* Section Title */}
                <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6 text-center">
                    Explore Our Features
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Text to BPMN */}
                    <a href="/dashboard/text2bpmn" className="aspect-video rounded-xl bg-gray-100 dark:bg-gray-700 p-6 flex items-center justify-center transform hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-lg">
                        <FaFileAlt className="text-3xl text-blue-500 dark:text-blue-300 mr-4" />
                        <span className="text-xl font-semibold text-gray-800 dark:text-white">Text to BPMN</span>
                    </a>

                    {/* Card 2: Image to BPMN */}
                    <a href="/dashboard/image2bpmn" className="aspect-video rounded-xl bg-gray-100 dark:bg-gray-700 p-6 flex items-center justify-center transform hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-lg">
                        <FaImage className="text-3xl text-pink-500 dark:text-pink-300 mr-4" />
                        <span className="text-xl font-semibold text-gray-800 dark:text-white">Image to BPMN</span>
                    </a>

                    {/* Card 3: Chatbot */}
                    <a href="/dashboard/chatbot" className="aspect-video rounded-xl bg-gray-100 dark:bg-gray-700 p-6 flex items-center justify-center transform hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-lg">
                        <FaRobot className="text-3xl text-purple-500 dark:text-purple-300 mr-4" />
                        <span className="text-xl font-semibold text-gray-800 dark:text-white">Chatbot</span>
                    </a>
                </div>
            </div>
        </>
    );
}