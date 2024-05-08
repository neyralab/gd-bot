import axiosInstance from "./axiosInstance";
import { saveBlob, downloadFile } from "gdgateway-client";

export const getDownloadOTT = (body) => {
  const url = `${process.env.REACT_APP_API_PATH}/download/generate/token`;
  return axiosInstance.post(url, body);
};

export const getFilesEffect = async (page = 1, order = "asc", token) => {
  const url = `${process.env.REACT_APP_API_PATH}/files?page=${page}&order_by=createdAt&order=${order}`;

  return await axiosInstance
    .create({
      headers: {
        "X-Token": `Bearer ${token}`,
      },
    })
    .get(url)
    .then((result) => result.data);
};

export const getFilePreviewEffect = async (
  fileId,
  cancelToken = null,
  type = undefined
) => {
  const {
    data: {
      user_tokens: { token: oneTimeToken },
      gateway,
    },
  } = await getDownloadOTT([{ slug: fileId }]);

  let url;
  if (type.includes("doc")) {
    url = `${gateway.url}/doc/preview/${fileId}`;
    return axiosInstance
      .create({
        headers: {
          "One-Time-Token": oneTimeToken,
        },
      })
      .get(url, null, {
        options: {
          responseType: "blob",
          cancelToken,
        },
      })
      .then((response) => {
        const urlCreator = window.URL || window.webkitURL;
        return urlCreator.createObjectURL(response.data);
      })
      .catch((response) => {
        throw response;
      });
  } else {
    url = `${gateway.url}/preview/${fileId}`;

    const blob = fetch(url, {
      headers: {
        "One-Time-Token": oneTimeToken,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const urlCreator = window.URL || window.webkitURL;
        return urlCreator.createObjectURL(blob);
      })
      .catch(() => {
        return null;
      });

    return blob;
  }
};

export const getTotalDownloadFileSize = (files) => {
  const totalSize = files.reduce((accumulator, file) => {
    return accumulator + file.size;
  }, 0);

  return totalSize;
};

export const downloadFileEffect = async (file, afterCb) => {
  const {
    data: {
      user_tokens: { token: oneTimeToken },
      gateway,
      upload_chunk_size,
    },
  } = await getDownloadOTT([{ slug: file.slug }]);
  const controller = new AbortController();

  const blob = await downloadFile({
    file,
    oneTimeToken,
    endpoint: gateway.url,
    isEncrypted: false,
    signal: controller.signal,
    uploadChunkSize: upload_chunk_size[file.slug] || gateway.upload_chunk_size,
  });
  if (blob && !blob?.failed) {
    const realBlob = new Blob([blob]);
    saveBlob({ blob: realBlob, name: file?.name, mime: file?.mime });
    afterCb && afterCb(file);
    return;
  }
};

export const autoCompleteSearchEffect = async (term = "") => {
  const url = `${process.env.REACT_APP_API_PATH}/search/autocomplete?term=${term}`;
  return await axiosInstance
    .get(url)
    .then(({ data }) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getFileInfoEffect = async (id) => {
  const url = `${process.env.REACT_APP_API_PATH}/files/file/${id}`;
  return await axiosInstance
    .get(url)
    .then(({ data }) => {
      return data.entry;
    })
    .catch((error) => {
      console.error(error);
    });
};

export const updateShareEffect = async (
  fileId,
  shareId = 1,
  canComment = false,
  canEdit = false,
  expiredAt = 0
) => {
  const url = `${process.env.REACT_APP_API_PATH}/files/${fileId}/share/${shareId}`;

  return axiosInstance
    .post(url, {
      canComment: canEdit || canComment,
      canEdit,
      expiredAt,
    })
    .then((response) => {
      return response.data;
    })
    .catch((response) => {
      throw response;
    });
};

export const updateEntrySorting = async (direction) => {
  const body = {
    orderBy: "createdAt",
    orderDirection: direction,
    page: "root_files",
  };
  return axiosInstance
    .post(`${process.env.REACT_APP_API_PATH}/entry-sorting`, body)
    .catch((e) => {
      throw e;
    });
};
