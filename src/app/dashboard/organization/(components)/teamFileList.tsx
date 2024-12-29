'use client'

import * as React from "react"
import { FaDownload } from "react-icons/fa"

interface File {
    name: string
    createdAt: string
    createdBy: string
    downloadUrl: string
}

const files: File[] = [
    {
        name: "File1.bpmn",
        createdAt: "2023-10-01",
        createdBy: "User1",
        downloadUrl: "/downloads/file1.bpmn",
    },
    {
        name: "File2.bpmn",
        createdAt: "2023-10-02",
        createdBy: "User2",
        downloadUrl: "/downloads/file3.bpmn",
    },
    {
        name: "File3.bpmn",
        createdAt: "2023-10-02",
        createdBy: "User3",
        downloadUrl: "/downloads/file4.bpmn",
    },
    {
        name: "File4.bpmn",
        createdAt: "2023-10-02",
        createdBy: "User4",
        downloadUrl: "/downloads/file5.bpmn",
    },
]

export function TeamFileList() {
    return (
        <div className="container mx-auto p-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg">
            <h5 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Team File List</h5>
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 dark:text-gray-200">File Name</th>
                        <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Created At</th>
                        <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Created By</th>
                        <th className="py-3 px-6 text-left text-sm font-medium text-gray-600 dark:text-gray-200">Download</th>
                    </tr>
                </thead>
                <tbody>
                    {files.map((file, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300">
                            <td className="py-3 px-6 text-sm text-gray-700 dark:text-gray-300">{file.name}</td>
                            <td className="py-3 px-6 text-sm text-gray-700 dark:text-gray-300">{file.createdAt}</td>
                            <td className="py-3 px-6 text-sm text-gray-700 dark:text-gray-300">{file.createdBy}</td>
                            <td className="py-3 px-6 text-sm text-gray-700 dark:text-gray-300">
                                <a
                                    href={file.downloadUrl}
                                    className="inline-flex items-center justify-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 transition-all duration-300 transform hover:scale-110"
                                    download
                                >
                                    <FaDownload className="ml-2" />
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}