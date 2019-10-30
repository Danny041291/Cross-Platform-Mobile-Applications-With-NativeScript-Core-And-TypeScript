
export interface IStorable {

    setStorageMode(volatile: boolean);

    update();

    delete();

}