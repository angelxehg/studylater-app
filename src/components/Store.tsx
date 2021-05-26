import React, { createContext, useContext, useEffect, useState } from 'react';
import { Md5 } from 'ts-md5/dist/md5';
import { Capacitor } from '@capacitor/core';
import { HTTP } from '@ionic-native/http';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

interface SimpleDocLink {
  name: string
  url: string
  mime: string
  ext: string
}

const mainData: SimpleDocLink[] = [
  {
    name: "Ejemplo desde FTP",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    mime: "application/pdf",
    ext: ".pdf"
  },
  {
    name: "Ejemplo desde Google Drive",
    url: "https://drive.google.com/file/d/10yftWZCU9NUgXurjEhXqsHCrzv1eJgkx/view?usp=sharing",
    mime: "application/pdf",
    ext: ".pdf"
  },
]


export interface DocumentRef {
  name: string
  url: string
  offline: boolean
}

export interface DocumentPath {
  url: string
  local: string
}

type StoreContextType = {
  documents: DocumentRef[]
  open: (rawUrl: string) => Promise<void>
  download: (rawUrl: string) => Promise<void>
  remove: (rawUrl: string) => Promise<void>
}

const defaultStoreContext: StoreContextType = {
  documents: [],
  open: (rawUrl: string) => {
    throw new Error('open not implemented')
  },
  download: (rawUrl: string) => {
    throw new Error('download not implemented')
  },
  remove: (rawUrl: string) => {
    throw new Error('remove not implemented')
  },
}

const StoreContext = createContext<StoreContextType>(defaultStoreContext);

export const useStore = () => useContext<StoreContextType>(StoreContext)

interface StoreContextProviderProps {
  children: React.ReactChildren | React.ReactChild
}

const getPaths = async (): Promise<DocumentPath[]> => {
  const raw = localStorage.getItem('PATHS');
  if (!raw) {
    return [];
  }
  try {
    const items: DocumentPath[] = await JSON.parse(raw);
    return items;
  } catch (err) {
    console.error(err);
    localStorage.removeItem('PATHS');
    return [];
  }
}

const StoreContextProvider = (props: StoreContextProviderProps) => {
  const [documentItems, setDocumentItems] = useState<DocumentRef[]>([]);
  const [availablePaths, setAvailablePaths] = useState<DocumentPath[]>([]);

  const openDocument = async (rawUrl: string) => {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      throw new Error('Operación no permitida en versión Web');
    }
    const docPath = availablePaths.find(p => p.url === rawUrl);
    if (!docPath) {
      throw new Error('Documento no ha sido descargado');
    }
    // Open
    await FileOpener.open(docPath.local, 'application/pdf');
  }

  const downloadDocument = async (rawUrl: string) => {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      throw new Error('Operación no permitida en versión Web');
    }
    if (availablePaths.find(i => i.url === rawUrl)) {
      throw new Error('El documento ya fue descargado');
    }
    // Get data
    const fileHash = Md5.hashStr(rawUrl);
    const fileURL = rawUrl; // Validaciones
    const filePath = `${File.dataDirectory}${fileHash}.pdf`;
    // Download
    await HTTP.downloadFile(fileURL, {}, {}, filePath);
    const newReference = {
      url: rawUrl,
      local: filePath
    }
    const next = availablePaths.concat([newReference]);
    localStorage.setItem('PATHS', JSON.stringify(next));
    setAvailablePaths(next);
  }

  const removeDocument = async (rawUrl: string) => {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      throw new Error('Operación no permitida en versión Web');
    }
    const fileHash = Md5.hashStr(rawUrl);
    await File.removeFile(File.dataDirectory, `${fileHash}.pdf`)
    const next = availablePaths.filter(i => i.url !== rawUrl);
    localStorage.setItem('PATHS', JSON.stringify(next));
    setAvailablePaths(next)
  }

  useEffect(() => {
    getPaths().then(i => setAvailablePaths(i));
  }, []);

  useEffect(() => {
    const availableUrls = availablePaths.map(i => i.url);
    setDocumentItems(mainData.map(item => {
      return {
        name: item.name,
        url: item.url,
        offline: availableUrls.includes(item.url),
      }
    }))
  }, [availablePaths]);

  return (
    <StoreContext.Provider value={{
      documents: documentItems,
      open: openDocument,
      download: downloadDocument,
      remove: removeDocument
    }}>
      {props.children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider;
