import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const storage = getStorage();


// Create the file metadata
/** @type {any} */
const metadata: any = {
  contentType: "image/jpeg",
};

export const uploadImage = async (file: any) => {

  // firebase upload image to storage with resumable upload
  const storageRef = ref(storage, `images/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
        default:
          console.log("upload task state is: ", snapshot.state);
          break;
      }
    },
    (error) => {
      console.error(error);
    }
  );
  await uploadTask;
  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  return downloadURL;
};
