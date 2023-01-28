import path from 'path';
import { fileURLToPath } from 'url';

import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


export const uploadFile = ( files, extensionsValid = ['png', 'jpg', 'jpeg', 'gif'], folder = '' ) => {
    return new Promise( (resolve, reject) => {
        const { file } = files;

        const nameCut = file.name.split('.')
        const extension = nameCut[ nameCut.length - 1 ];

        // validar extension
        if( !extensionsValid.includes( extension ) ){
            reject( `Invalid extension: ${ extension } || Valid: ${extensionsValid}` )
        }

        const nameChange = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/', folder,  nameChange );

        file.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }
            
            resolve( nameChange );
        });
    })
}