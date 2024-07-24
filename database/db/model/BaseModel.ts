import {
    collection,
    where,
    doc,
    getDocs,
    addDoc,
    DocumentReference,
    DocumentData,
    query,
    getDoc,
    updateDoc,
    orderBy,
    OrderByDirection,
  } from "firebase/firestore";
  import {  db } from "../../../firebase";
  
  class BaseModel {
    moduleName: string;
  
    constructor(moduleName: string) {
      this.moduleName = moduleName;
    }
    async count(){
      try {
        const querySnapshot = await getDocs(collection(db, this.moduleName));
        return querySnapshot.size;
      } catch (error) {
        console.error("Error getting document:", error);
        throw error;
      }
    }
  
    async create(data:any): Promise<boolean> {
      try {
        const val=await addDoc(collection(db, this.moduleName), data);
        await updateDoc(val, { id: val.id ,created_at: new Date(),updated_at: new Date(),deleted_at: null});
        return true;
      } catch (error) {
        console.error("Error creating document:", error);
        return false;
      }
    }
  
    async update(id: string, data:any): Promise<boolean> {
      try {
        const docRef = doc(db, this.moduleName, id);
        await updateDoc(docRef, data);
        await updateDoc(docRef, { updated_at: new Date() });
        return true;
      } catch (error) {
        console.error("Error updating document:", error);
        return false;
      }
    }
    
  
    async delete(id: string): Promise<boolean> {
      try {
        await updateDoc(doc(db, this.moduleName, id), { deleted_at: new Date() });
        return true;
      } catch (error) {
        console.error("Error deleting document:", error);
        return false;
      }
    }
  
    async getById(id: string): Promise<any> {
      try {
        const docRef: DocumentReference<DocumentData> = doc(
          db,
          this.moduleName,
          id
        );
        const docSnap = await getDoc(docRef);
  
        if (!docSnap.exists()) {
          console.log("No such document!");
          return null;
        }
  
        const data = docSnap.data();
        return data;
      } catch (error) {
        console.error("Error getting document:", error);
        return null;
      }
    }
    async getByIds(ids: string[]): Promise<any> {
      try {
        const data: DocumentData[] = [];
        for (const id of ids) {
          const docRef: DocumentReference<DocumentData> = doc(
            db,
            this.moduleName,
            id
          );
          const docSnap = await getDoc(docRef);
  
          if (!docSnap.exists()) {
            console.log("No such document!");
            return null;
          }
  
          data.push(docSnap.data());
        }
        return data;
      } catch (error) {
        console.error("Error getting document:", error);
        throw error;
      }
    }
  
    async getAll(): Promise<any> {
      try {
        const q = await query(
          collection(db, this.moduleName),
          where("deleted_at", "==", null)
        );
        const querySnapshot = await getDocs(q);
      const data: DocumentData[] = [];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      return data;
      } catch (error) {
        console.error("Error getting document:", error);
        throw error;
      }
    }
  
    async getByWhere(whereField: string, whereValue: string): Promise<any> {
      try {
        const q = query(
          collection(db, this.moduleName),
          where("deleted_at", "==", null),
          where(whereField, "==", whereValue)
        );
        const querySnapshot = await getDocs(q);
        const data: DocumentData[] = [];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        return data;
      } catch (error) {
        console.error("Error getting document:", error);
        throw error;
      }
    }
    async getOrderBy(orderField: string,orderValue: OrderByDirection): Promise<DocumentData[]> {
      try {
        const q = query(
          collection(db, this.moduleName),
          orderBy(orderField, orderValue)
        );
  
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot.docs);
        const data: DocumentData[] = [];
  
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
  
        return data;
      } catch (error) {
        console.error("Error getting documents:", error);
        throw error;
      }
    }
  
  }
  
  export default BaseModel;
  