import React, { useState } from "react";
import { useRecoilState } from "recoil";
import Button from "../Button";
import Modal from "../Modal";
import { currentBranch, deleteBranch } from "../../../atoms";
import { useNavigate } from "react-router-dom";
import styles from "./DeleteBranch.module.css";

function DeleteBranch(props) {
  const { branch } = props;
  const navigate = useNavigate();
  const [curBranch, setCurBranch] = useRecoilState(currentBranch);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentErrorModalOpen, setCurrentErrorModalOpen] = useState(false);
  const [commitErrorModalOpen, setCommitErrorModalOpen] = useState(false);

  const { ipcRenderer } = window.require("electron");
  const currentRepo = localStorage.getItem("currentRepo");

  const deleteLocalBranches = (branch) => {
    const deletebranch = ipcRenderer.sendSync(
      "deleteLocalBranch",
      currentRepo,
      branch
    );
    return deletebranch;
  };

  const deleteRemoteBranches = (branch) => {
    ipcRenderer.sendSync("deleteRemoteBranch", currentRepo, branch);
  };

  const openModal = () => {
    branch === curBranch ? setCurrentErrorModalOpen(true) : setModalOpen(true);
  };

  const closeModal = () => {
    branch === curBranch
      ? setCurrentErrorModalOpen(false)
      : setModalOpen(false);
  };

  const branchDeleter = () => {
    branch.includes("origin/")
      ? deleteRemoteBranches(branch.replace("origin/", ""))
      : deleteLocalBranches(branch);
    closeModal();
  };

  const goPush = () => {
    setCommitErrorModalOpen(false);
    navigate("/push");
  };

  return (
    <>
      <Button
        action={openModal}
        content={"branch 삭제"}
        style={{ border: "1px solid #7B7B7B" }}
      />

      <Modal
        open={modalOpen}
        content={
          <>
            <p>
              <span className={styles.branchName}>{branch}</span> branch를
              정말로 삭제하시겠습니까?
            </p>
            <p>(삭제한 branch는 복구가 불가능합니다.)</p>
          </>
        }
      >
        <div className={styles.buttonContainer}>
          <Button
            action={branchDeleter}
            content={"예"}
            style={{ backgroundColor: "#6BCC78" }}
          />
          <Button
            action={closeModal}
            content={"아니오"}
            style={{ border: "1px solid #7B7B7B" }}
          />
        </div>
      </Modal>
      <Modal
        open={currentErrorModalOpen}
        content={
          <>
            <p>현재 브랜치는 삭제할 수 없습니다.</p>
          </>
        }
      >
        <div className={styles.buttonContainer}>
          <Button
            action={closeModal}
            content={"돌아가기"}
            style={{ backgroundColor: "#6BCC78" }}
          />
        </div>
      </Modal>
    </>
  );
}

export default DeleteBranch;
