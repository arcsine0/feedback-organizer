import { useState } from "react"

export default function GradesTable() {
    const [finalGrade, setFinalGrade] = useState(0);
    const [scaledGrade, setScaledGrade] = useState(0);

    const setScores = () => {
        const quizVal = parseInt(document.getElementById('quizzes').value, 10) || 0;
        const labVal = parseInt(document.getElementById('lab').value, 10) || 0;
        const examVal = parseInt(document.getElementById('exam').value, 10) || 0;

        const calcGrade = (quizVal * 0.3) + (labVal * 0.3) + (examVal * 0.4);

        setFinalGrade(calcGrade)

        const scaleReference = {
            74.5: 0,
            76.5: 1,
            78.5: 1.25,
            80.5: 1.5,
            82.5: 1.75,
            84.5: 2,
            86.5: 2.25,
            88.5: 2.5,
            90.5: 2.75,
            92.5: 3,
            94.5: 3.25,
            96.5: 3.5,
            98.5: 3.75,
            100: 4,
          };
      
          const gradeKeys = Object.keys(scaleReference);
          let scale = 0;
      
          for (let i = gradeKeys.length - 1; i >= 0; i--) {
            if (calcGrade >= parseFloat(gradeKeys[i])) {
              scale = scaleReference[gradeKeys[i]];
              break;
            }
          }
      
          setScaledGrade(scale);
    }

    return (
        <div className="flex justify-center items-center w-50 p-2 shadow-md rounded-lg">
            <div className="flex flex-col space-y-4">
                <div>
                    <label htmlFor="quizzes" className="block text-sm font-medium leading-6 text-gray-900">Quizzes</label>
                    <input
                        type="number"
                        name="quizzes"
                        id="quizzes"
                        className="p-2 border-2 rounded-lg"
                    />
                </div>
                <div>
                    <label htmlFor="lab" className="block text-sm font-medium leading-6 text-gray-900">Lab Activities</label>
                    <input
                        type="number"
                        name="lab"
                        id="lab"
                        className="p-2 border-2 rounded-lg"
                    />
                </div>
                <div>
                    <label htmlFor="exam" className="block text-sm font-medium leading-6 text-gray-900">Final Exam</label>
                    <input
                        type="number"
                        name="exam"
                        id="exam"
                        className="p-2 border-2 rounded-lg"
                    />
                </div>
                <button onClick={setScores} className="flex h-5 p-5 justify-center items-center shadow-md rounded-md text-white font-semibold bg-gradient-to-r from-sky-500 to-indigo-500">Submit</button>
                <div className="h-0.5 bg-black opacity-10 rounded-md"></div>
                <table className="table-auto">
                    <tbody>
                        <tr>
                            <td className="text-md font-bold">Grade</td>
                            <td>{finalGrade}</td>
                        </tr>
                        <tr>
                            <td className="text-md font-bold">Final Grade</td>
                            <td>{scaledGrade}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}