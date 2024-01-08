import React, { useEffect, useState } from "react";
import SideBar from "../../common/sidebar/SideBar";
import "../student.css";
import studentApi from "../../../api/studentApi";
import { useUser } from "../../../context/UserContext";
import Container from "react-bootstrap/esm/Container";

const StudentInfor = () => {
  const { userInfo } = useUser();
  const [studentInfor, setStudentInfor] = useState([]);

  const [firstSelectValue, setFirstSelectValue] = useState("");
  const [secondSelectValue, setSecondSelectValue] = useState("");
  const [optionsForSecondSelect, setOptionsForSecondSelect] = useState([]);

  //Select English cert
  const handleFirstSelectChange = (event) => {
    const selectedValue = event.target.value;
    setFirstSelectValue(selectedValue);

    // Dựa vào giá trị của select đầu tiên, cập nhật danh sách tùy chọn của select thứ hai
    if (selectedValue === "option1") {
      setOptionsForSecondSelect([
        "9.0",
        "8.5",
        "8.0",
        "7.5",
        "7.0",
        "6.5",
        "6.0",
        "5.5",
        "5.0",
        "4.5",
        "4.0",
      ]);
    } else if (selectedValue === "option2") {
      setOptionsForSecondSelect(["Option X", "Option Y", "Option Z"]);
    } else {
      setOptionsForSecondSelect([]);
    }

    setSecondSelectValue("");
  };

  const handleSecondSelectChange = (event) => {
    const selectedValue = event.target.value;
    setSecondSelectValue(selectedValue);
  };

  //call API
  console.log(userInfo);
  useEffect(() => {
    const fetchStudentInfor = async () => {
      try {
        let response = await studentApi.get(userInfo._id, userInfo.accessToken);
        console.log(response);
        let data = response;
        setStudentInfor(data);
      } catch (error) {
        console.log("Failed to fetch student infor ", error);
      }
    };
    fetchStudentInfor();
  }, [userInfo]);

  return (
    <div>
      <SideBar />
      <Container>
        <div className="row row-space-20 student-infor">
          <div className="col-md-12">
            <div className="tab-content p-0">
              <div className="tab-pane active show" id="profile-about">
                <table className="table table-profile">
                  <thead>
                    <tr>
                      <th colSpan="2">THÔNG TIN CÁ NHÂN</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="field">Mã sinh viên</td>
                      <td className="value">{studentInfor._id}</td>
                    </tr>
                    <tr>
                      <td className="field">Họ và tên</td>
                      <td className="value">{studentInfor.name}</td>
                    </tr>
                    <tr>
                      <td className="field">Giới tính</td>
                      <td className="value">{studentInfor.sex}</td>
                    </tr>
                    <tr>
                      <td className="field">Ngày sinh</td>
                      <td className="value">{studentInfor.birthday}</td>
                    </tr>
                    <tr>
                      <td className="field">Khoa</td>
                      <td className="value">{studentInfor.field}</td>
                    </tr>
                    <tr>
                      <td className="field">Ngành học</td>
                      <td className="value">{studentInfor.major}</td>
                    </tr>
                    <tr>
                      <td className="field">Số điện thoại</td>
                      <td className="value">{studentInfor.phone}</td>
                    </tr>
                    <tr>
                      <td className="field">Email</td>
                      <td className="value">{studentInfor.email}</td>
                    </tr>
                  </tbody>
                </table>
                <table className="table table-profile">
                  <thead>
                    <tr>
                      <th colSpan="2">Kết quả học tập</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="field">CPA</td>
                      <td className="value">{studentInfor.cpa}</td>
                    </tr>
                  </tbody>
                </table>

                <table className="table table-profile table-cert">
                  <thead>
                    <tr>
                      <th colSpan="2">Chứng chỉ ngoại ngữ</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="field">
                        <select
                          value={firstSelectValue}
                          onChange={handleFirstSelectChange}
                        >
                          <option value="">Tên chứng chỉ</option>
                          <option value="option1">IELTS</option>
                          <option value="option2">Toiec</option>
                        </select>
                      </td>
                      <td className="value">
                        <select
                          value={secondSelectValue}
                          onChange={handleSecondSelectChange}
                        >
                          <option value="">Điểm</option>
                          {optionsForSecondSelect.map((option, index) => (
                            <option key={index} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button
                  className="add-english"
                  onClick={() => alert("Thêm chứng chỉ thành công")}
                >
                  Thêm chứng chỉ ngoại ngữ (nếu có)
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default StudentInfor;
