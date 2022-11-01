import React, { useEffect, useState } from "react";
import { Octokit } from "octokit";
import styles from "./GitDiff.module.css";

export default function GitDiff() {
  // 마지막으로 커밋한 날짜
  const [date, setDate] = useState("");
  // 마지막으로 커밋한 사람
  const [user, setUser] = useState("");
  // 마지막 커밋 메세지
  const [message, setMessage] = useState("");
  // 마지막 커밋 로그
  const [commit, setCommit] = useState("");
  // 마지막 커밋 변경 파일 목록
  const [files, setFiles] = useState([]);
  // 마지막 커밋에서 모든 파일의 코드
  const [codeBefore, setCodeBefore] = useState([]);
  const [codeAfter, setCodeAfter] = useState([]);
  const [fileIdx, setFileIdx] = useState(0);

  useEffect(() => {
    // 해당 branch 정보 가져오기
    // auth, owner, repo, branch 변수에 저장해서 사용해야 함
    async function getBranch() {
      const octokit = new Octokit({
        auth: "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",
      });

      const branch = await octokit.request(
        "GET /repos/{owner}/{repo}/branches/{branch}",
        {
          owner: "junghyun1009",
          repo: "TIL",
          branch: "main",
        }
      );

      // console.log(branch);
      // console.log(branch.data.commit.commit.author);
      setDate(branch.data.commit.commit.author.date);
      setUser(branch.data.commit.commit.author.name);
      setMessage(branch.data.commit.commit.message);
      setCommit(branch.data.commit.sha);
    }
    getBranch();
  }, []);

  useEffect(() => {
    // 해당 branch 마지막 커밋 정보 가져오기
    // auth, owner, repo 변수에 저장해서 사용해야 함
    async function getCommit() {
      const octokit = new Octokit({
        auth: "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",
      });

      const commitInfo = await octokit.request(
        "GET /repos/{owner}/{repo}/commits/{ref}",
        {
          owner: "junghyun1009",
          repo: "TIL",
          ref: commit,
        }
      );

      // console.log("11", commitInfo);
      setFiles(commitInfo.data.files);
      let fileBefore = [];
      let fileAfter = [];
      commitInfo.data.files.map((file) => {
        // setCodes((prev) => [...prev, file.patch.split("\n")]);
        let before = [];
        let after = [];
        let lines = file.patch.split("\n");
        lines.map((line) => {
          if (line[0] === "-") {
            before.push(line);
          } else if (line[0] === "+") {
            after.push(line);
          } else {
            before.push(line);
            after.push(line);
          }
        });
        fileBefore.push(before);
        fileAfter.push(after);
        console.log("before", before);
        console.log("after", after);
        console.log("files", commitInfo.data.files);
      });
      console.log("fileBefore", fileBefore);
      console.log("fileAfter", fileAfter);
      setCodeBefore(fileBefore);
      setCodeAfter(fileAfter);
    }
    getCommit();
  }, [commit]);

  const showCode = (index) => {
    setFileIdx(index);
  };
  return (
    <>
      <div className={styles.textbox}>
        <div className={styles.text}>최종 수정 시간 : {date}</div>
        <div className={styles.text}>변경한 사람 : {user}</div>
        <div className={styles.text}>커밋 메세지 : {message}</div>
      </div>
      <div>
        {files.length && codeBefore.length && codeAfter.length ? (
          <div>
            <div className={styles.codebox}>
              {files.map((file, index) => (
                <div
                  key={index}
                  className={styles.file}
                  onClick={() => showCode(index)}
                >
                  {index === fileIdx ? (
                    <div className={styles.active}>{file.filename}</div>
                  ) : (
                    <div>{file.filename}</div>
                  )}
                </div>
              ))}
            </div>
            <div className={styles.code}>
              <div className={styles.codebefore}>
                <div className={styles.title}>변경 전</div>
                <div className={styles.box}>
                  {codeBefore[fileIdx].map((code, index) => (
                    <div key={index}>
                      {code[0] === "-" ? (
                        <div className={styles.minus}>{code}</div>
                      ) : (
                        <div>{code}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.codeafter}>
                <div className={styles.title}>변경 후</div>
                <div className={styles.box}>
                  {codeAfter[fileIdx].map((code, index) => (
                    <div key={index}>
                      {code[0] === "+" ? (
                        <div className={styles.plus}>{code}</div>
                      ) : (
                        <div>{code}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
