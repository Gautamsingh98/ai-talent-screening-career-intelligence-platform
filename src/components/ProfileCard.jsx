import { FaUserCircle } from "react-icons/fa";
import SkillBadge from "./SkillBadge";

export default function ProfileCard() {

  const skills = [
    "Python",
    "SQL",
    "Machine Learning",
    "Pandas",
    "NumPy",
  ];

  return (

    <div className="bg-white rounded-xl shadow-md p-8">

      {/* Profile Header */}

      <div className="flex items-center gap-6">

        <FaUserCircle className="text-8xl text-blue-600" />

        <div>

          <h2 className="text-3xl font-bold">

            Gautam Singh

          </h2>

          <p className="text-gray-500">

            Data Science Student

          </p>

        </div>

      </div>

      {/* Personal Information */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

        <div>

          <h3 className="font-semibold">
            Email
          </h3>

          <p className="text-gray-600">
            gautam@gmail.com
          </p>

        </div>

        <div>

          <h3 className="font-semibold">
            Phone
          </h3>

          <p className="text-gray-600">
            +977-98XXXXXXXX
          </p>

        </div>

        <div>

          <h3 className="font-semibold">
            University
          </h3>

          <p className="text-gray-600">
            Purbanchal University
          </p>

        </div>

        <div>

          <h3 className="font-semibold">
            Degree
          </h3>

          <p className="text-gray-600">
            BIT
          </p>

        </div>

      </div>

      {/* Skills */}

      <div className="mt-10">

        <h3 className="text-xl font-bold mb-5">

          Skills

        </h3>

        <div className="flex flex-wrap gap-3">

          {skills.map((skill) => (

            <SkillBadge
              key={skill}
              skill={skill}
            />

          ))}

        </div>

      </div>

      {/* Button */}

      <div className="mt-10">

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">

          Edit Profile

        </button>

      </div>

    </div>

  );

}