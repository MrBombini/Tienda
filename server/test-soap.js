import soap from 'soap';
import fs from 'fs';

const url = 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL';

soap.createClient(url, (err, client) => {
    if (err) {
        console.error('Error creando cliente:', err);
        return;
    }

    client.ListOfCountryNamesByCode({}, (err, result) => {
        if (err) {
            console.error('Error llamando al servicio:', err);
            return;
        }

        const countries = result.ListOfCountryNamesByCodeResult.tCountryCodeAndName;

        // Mostrar por consola
        countries.forEach(country => {
            console.log(`${country.sISOCode} - ${country.sName}`);
        });

        // Guardar en archivo JSON
        fs.writeFile('countries.json', JSON.stringify(countries, null, 2), (err) => {
            if (err) {
                console.error('Error al guardar el archivo JSON:', err);
            } else {
                console.log('Archivo countries.json guardado correctamente.');
            }
        });
    });
});
