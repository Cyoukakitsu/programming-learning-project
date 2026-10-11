import { useState, useEffect } from "react";
import { useAtom } from "jotai";

import { uploadAvatar } from "../../services/APIStorage";
import { userAtom } from "../../atoms/user";
import { getTeacherByTeacherId } from "../../services/APITeacher";
import { getConfig } from "../../utils/configHelper";

function Info() {
  const [user, setUser] = useAtom(userAtom);

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(user.avatar);
  const [avatarFile, setAvatarFile] = useState(null);

  // 更新 avatar
  useEffect(() => {
    setCurrentAvatarUrl(user?.avatar || "");
  }, [user]);

  const [classInChargeArr, setClassInChargeArr] = useState([]);

  useEffect(() => {
    async function loadData() {
      const token = getConfig("SUPABASE_TOKEN");
      const userToken = JSON.parse(localStorage.getItem(token));

      if (!userToken) return;

      const teachers = await getTeacherByTeacherId(userToken.user.id);
      const teacher = teachers[0];

      if (teacher?.class_in_charge) {
        setClassInChargeArr(JSON.parse(teacher.class_in_charge));
      }
    }

    loadData();
  }, []);

  function handleImageChange(e) {
    const file = e.target.files[0];
    setAvatarFile(!file);

    const newAvatarUrl = URL.createObjectURL(file);
    setCurrentAvatarUrl(newAvatarUrl);
  }

  async function onClick() {
    if (!avatarFile) {
      console.log("No file selected");
      return;
    }

    const data = await uploadAvatar(avatarFile);
    setUser(data.user.user_metadata);
  }

  return (
    <div className="w-96 max-w-full mx-auto shadow-2xl shadow-blue-300 rounded-box mt-40 px-8 py-10 bg-base-100">
      <div className="avatar flex justify-center mb-5">
        <div className="w-24 rounded-full">
          <label className="cursor-pointer" htmlFor="avatar-input">
            <img src={currentAvatarUrl} alt="avatar" />
          </label>
        </div>
      </div>

      <input
        id="avatar-input"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />

      <div className="w-3/4 mx-auto">
        <label className="input input-bordered flex items-center gap-2 my-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input type="text" className="grow" value="Alex" disabled />
        </label>

        {classInChargeArr.length > 0 && (
          <ul className="menu bg-base-200 rounded-box">
            <li>
              <details open>
                <summary>Class In Charge</summary>
                <ul>
                  {classInChargeArr.map((classItem, idx) => (
                    <li key={idx}>
                      <a className="pointer-events-none">
                        Class {classItem.split("|")[0]} | Year{" "}
                        {classItem.split("|")[1]}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          </ul>
        )}
      </div>

      <div className="text-center">
        <button className="btn btn-primary my-2" onClick={onClick}>
          Update Avatar
        </button>
      </div>
    </div>
  );
}

export default Info;
