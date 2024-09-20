const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 4000;

const spaceId = "h57rm720bgqw";
const accessToken = "c8IiRlZOFjze5n0pDuzdFfY8Y2HFQ7cAbthiUT5Exq4";
const bannerList = "portfolioPhotos";

// Middleware for CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// API Endpoint to fetch portfolio data from Contentful
app.get('/api/portfolio', async (req, res) => {
  try {
    const response = await axios.get(
      `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}&include=2`
    );
    
    const data = response.data;
    const bannerItems = data.items.filter(
      (item) => item.sys.contentType.sys.id === bannerList
    );
    const assetMap = createAssetMap(data.includes.Asset);
    const updatedItems = bannerItems.map((item) =>
      updateItemWithAssetUrlsAndDescription(item, assetMap)
    );

    res.json(updatedItems.map((item) => item.fields));
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ message: 'Error fetching data from Contentful' });
  }
});

function createAssetMap(assets) {
  const map = {};
  assets.forEach((asset) => {
    map[asset.sys.id] = asset.fields.file.url;
  });
  return map;
}

function updateItemWithAssetUrlsAndDescription(item, assetMap) {
  if (item.fields.image && item.fields.image.sys) {
    item.fields.image = assetMap[item.fields.image.sys.id];
  }
  return item;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
