import { uploadFile } from "../../../../api/uploadFile";
export const handleUploadFile = async (e) => {
  if (!e.target.files[0]) return;
  const payload = [
    {
      name: e.target.files[0].name,
      size: e.target.files[0].size,
      type: e.target.files[0].type,
      buffer: Array.from(new Uint8Array(await e.target.files[0].arrayBuffer())),
    },
  ];
  const { data } = await uploadFile(payload);
  const file = { name: data[0].name, url: data[0].url };
  return file;
};
