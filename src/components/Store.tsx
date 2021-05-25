import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFirestore, useFirestoreDocData, useUser } from 'reactfire';

interface SimpleDocLink {
  name: string
  url: string
}

interface MainDocModel {
  documents?: SimpleDocLink[]
}


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
  download: (i: DocumentRef) => void
  remove: (i: DocumentRef) => void
}

const defaultStoreContext: StoreContextType = {
  documents: [],
  download: (i: DocumentRef) => {
    throw new Error('download not implemented')
  },
  remove: (i: DocumentRef) => {
    throw new Error('remove not implemented')
  },
}

const StoreContext = createContext<StoreContextType>(defaultStoreContext);

export const useStore = () => useContext<StoreContextType>(StoreContext)

interface StoreContextProviderProps {
  children: React.ReactChildren | React.ReactChild
}

const StoreContextProvider = (props: StoreContextProviderProps) => {
  const { data: user } = useUser();
  const mainDocRef = useFirestore()
    .collection('studylater').doc(user.uid);
  const { data: mainData } = useFirestoreDocData<MainDocModel>(mainDocRef);

  const [documentItems, setDocumentItems] = useState<DocumentRef[]>([]);
  const [availablePaths, setAvailablePaths] = useState<DocumentPath[]>([]);

  const downloadDocument = (d: DocumentRef) => {
    console.log(`Descargando ${d.url}`);
    setAvailablePaths(availablePaths.concat([{
      url: d.url,
      local: '...'
    }]))
  }

  const removeDocument = (d: DocumentRef) => {
    console.log(`Eliminando ${d.url}`);
    setAvailablePaths(availablePaths
      .filter(i => i.url !== d.url)
    )
  }

  useEffect(() => {
    if (mainData.documents) {
      const availableUrls = availablePaths.map(i => i.url);
      setDocumentItems(mainData.documents.map(item => {
        return {
          name: item.name,
          url: item.url,
          offline: availableUrls.includes(item.url),
        }
      }))
    }
  }, [mainData, availablePaths]);

  return (
    <StoreContext.Provider value={{
      documents: documentItems,
      download: downloadDocument,
      remove: removeDocument
    }}>
      {props.children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider;
