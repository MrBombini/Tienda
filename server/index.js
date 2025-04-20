import express from 'express';
import cors from 'cors';
import axios from 'axios';
import soap from 'soap';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API endpoints for products
app.get('/api/products', async (req, res) => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

app.get('/api/products/categories', async (req, res) => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products/categories');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

app.get('/api/products/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const response = await axios.get(`https://fakestoreapi.com/products/category/${category}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching products by category:', error);
    res.status(500).json({ message: 'Failed to fetch products by category' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`https://fakestoreapi.com/products/${id}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ message: 'Failed to fetch product details' });
  }
});

// Country API using SOAP
app.get('/api/countries', async (_, res) => {
  try {
    const url = 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL';
    const client = await soap.createClientAsync(url);

    client.ListOfCountryNamesByCode({}, (err, result) => {
      if (err) {
        console.error('Error llamando al servicio SOAP:', err);
        return res.status(500).json({ message: 'Error llamando al servicio SOAP', error: err.message });
      }

      // console.log('Respuesta SOAP completa:', JSON.stringify(result, null, 2));

      const countries = result.ListOfCountryNamesByCodeResult?.tCountryCodeAndName;
      if (!countries) {
        console.error('Estructura inesperada en la respuesta SOAP:', result);
        return res.status(500).json({ message: 'No se encontraron países en la respuesta SOAP.' });
      }

      const countriesList = countries.map((country) => ({
        sISOCode: country.sISOCode,
        sName: country.sName        
      }));
      console.log('Respuesta SOAP completa:', countriesList);

      res.json(countriesList);
    });
  } catch (error) {
    console.error('Error en /api/countries:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to fetch countries', error: error.message });
  }
});

app.get('/api/country/:code', async (req, res) => {
  try {
    const { code } = req.params;
    const url = 'http://webservices.oorsprong.org/websamples.countryinfo/CountryInfoService.wso?WSDL';
    const client = await soap.createClientAsync(url);

    console.log('Métodos disponibles en el cliente SOAP:', client.describe());

    client.FullCountryInfo({ sCountryISOCode: code }, (err, result) => {
      if (err) {
        console.error('Error llamando al servicio SOAP:', err);
        return res.status(500).json({ message: 'Error llamando al servicio SOAP', error: err.message });
      }

      console.log('Respuesta SOAP completa:', JSON.stringify(result, null, 2));

      if (!result?.FullCountryInfoResult) {
        console.error('Estructura inesperada en la respuesta SOAP:', result);
        return res.status(500).json({ message: 'No se encontró información para el país.' });
      }

      const countryInfo = result.FullCountryInfoResult;

      // Transformar las propiedades para que coincidan con las esperadas por el frontend
      res.json({
        sISOCode: countryInfo.sISOCode,
        sName: countryInfo.sName,
        sCapitalCity: countryInfo.sCapitalCity,
        sPhoneCode: countryInfo.sPhoneCode,
        sContinentCode: countryInfo.sContinentCode,
        sCurrencyISOCode: countryInfo.sCurrencyISOCode,
        sCountryFlag: countryInfo.sCountryFlag,
        Languages: countryInfo.Languages?.tLanguage?.map((lang) => ({
          sISOCode: lang.sISOCode,
          sName: lang.sName,
        })) || [],
      });
    });
  } catch (error) {
    console.error('Error creando el cliente SOAP:', error.message);
    res.status(500).json({ message: 'Failed to fetch country details', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
