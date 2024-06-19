
export class ServerResponse<T, V> {
  
    success: boolean;
    data: T | null;
    error: V | null;
  
    constructor(initialValues: Partial<ServerResponse<T, V>>){
        Object.assign(this, initialValues )
      }
  
    }
  
  export class ServerError {
      code: number;
      msg: string;
  
      constructor(initialValues: Partial<ServerError>){
          Object.assign(this, initialValues);
        }
    }
  
  export function ServerSuccessResponse <T>(data: T) {
      return new ServerResponse<T, null>({
          success: true,
          data,
          error: null,
        });
    }
  
    export function ServerErrorResponse(error: Error, code: number) {
        return new ServerResponse<null, ServerError>({
            success: false,
            data: null,
            error: new ServerError({
                code,
                msg: error.message
              }),
          });
      }
  