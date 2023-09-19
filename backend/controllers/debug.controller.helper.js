function generateValidUPC() {
  // // Generate 11 random digits
  // let base = Math.floor(Math.random() * 1e11).toString().padStart(11, '0');

  // // Calculate the 12th checksum digit
  // let evenSum = 0;
  // let oddSum = 0;
  // for (let i = 0; i < base.length; i++) {
  //     if (i % 2 === 0) {
  //         oddSum += parseInt(base[i]);
  //     } else {
  //         evenSum += parseInt(base[i]);
  //     }
  // }
  // const totalSum = oddSum * 3 + evenSum;
  // const mod = totalSum % 10;
  // const checksum = (mod === 0) ? 0 : 10 - mod;

  // // Append the checksum digit to the original 11 digits to get a valid UPC-A barcode
  // return base + checksum;


  const valid_products = [
    { upc: '0884751661099' , upcData: `{
      "code": "OK",
      "total": 1,
      "offset": 0,
      "items": [
        {
          "ean": "0884751661099",
          "title": "Men's Nike Air Huarache Ultra Breathe Sneaker, Size 8 M - Grey",
          "description": "Engineered to stretch and rebound with every movement of your foot, this lightweight, flexible sneaker is crafted with a breathable Nike Tech Ultramesh upper and deep flex grooves in the sole for multidirectional agility. Color(s): black/ black/ white, pale grey/ grey/ white. Brand: NIKE. Style Name: Nike Air Huarache Ultra Breathe Sneaker (Men). Style Number: 5197354 2. Available in stores.",
          "upc": "884751661099",
          "brand": "Nike",
          "model": "833147",
          "color": "Gray",
          "size": "",
          "dimension": "",
          "weight": "",
          "category": "Apparel & Accessories > Shoes",
          "currency": "CAD",
          "lowest_recorded_price": 97.5,
          "highest_recorded_price": 175,
          "images": [
            "http://content.nordstrom.com/imagegallery/store/product/large/7/_100818927.jpg",
            "https://slimages.macysassets.com/is/image/MCY/products/7/optimized/8518907_fpx.tif?wid=300&fmt=jpeg&qlt=100",
            "http://s7d9.scene7.com/is/image/TheBay/884751661136_main?$PDPLARGE$"
          ],
          "offers": [
            {
              "merchant": "Hudson's Bay",
              "domain": "thebay.com",
              "title": "Nike Air Huarache Run Shoes-GREY-8",
              "currency": "CAD",
              "list_price": "",
              "price": 131.25,
              "shipping": "Free Shipping",
              "condition": "New",
              "availability": "Out of Stock",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2t2x203w223e484s2&tid=1&seq=1695082645&plt=f986fa3b2840b77445175aa63c4a9b0c",
              "updated_t": 1509407270
            },
            {
              "merchant": "NORDSTROM.com",
              "domain": "nordstrom.com",
              "title": "Men's Nike Air Huarache Ultra Breathe Sneaker, Size 8 M - Grey",
              "currency": "",
              "list_price": 130,
              "price": 99.98,
              "shipping": "Free Shipping",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2s233t21353d4a4y2&tid=1&seq=1695082645&plt=3df630279f1dcde16b710a5acaaf4444",
              "updated_t": 1501878985
            },
            {
              "merchant": "Macy's",
              "domain": "macys.com",
              "title": "Nike Men's Air Huarache Ultra Breathe Casual Sneakers from Finish Line",
              "currency": "",
              "list_price": 130,
              "price": 97.5,
              "shipping": "10.95",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2s243z2x26394d4x2&tid=1&seq=1695082645&plt=c9d8a1b753557bfdae509ec4b43883d3",
              "updated_t": 1498773111
            }
          ]
        }
      ]
    }`},
    { upc: '0857372006549', upcData: `{
      "code": "OK",
      "total": 1,
      "offset": 0,
      "items": [
        {
          "ean": "0857372006549",
          "title": "Glorious PC Gaming Race Padded Keyboard Wrist Rest - Stealth - Full Size - Regular",
          "description": "445 x 102 x 25 mm  Black. Simply the best wrist pad to pair up with your gaming/mechanical keyboard. Dimensions: 445 mm x 102 mm x 25 mm Surface: Cloth Base: Non-slip rubber Color: Black Special Features: Full sizeFoam interior Gaming: Yes",
          "upc": "857372006549",
          "brand": "Glorious PC Gaming Race",
          "model": "GWR-100-STEALTH",
          "color": "Blue",
          "size": "",
          "dimension": "",
          "weight": "",
          "category": "Electronics > Electronics Accessories > Computer Accessories > Keyboard & Mouse Wrist Rests",
          "currency": "CAD",
          "lowest_recorded_price": 22.1,
          "highest_recorded_price": 58.99,
          "images": [
            "https://i5.walmartimages.com/asr/800bc05f-33a8-4256-a495-3ef2f743650e_1.f787bd3df97ef1181ba6c434139690a2.jpeg?odnHeight=450&odnWidth=450&odnBg=ffffff",
            "https://c1.neweggimages.com/ProductImageCompressAll640/A4YU_1_201910232055775201.jpg"
          ],
          "offers": [
            {
              "merchant": "Newegg Canada",
              "domain": "Newegg Canada",
              "title": "Glorious PC Gaming Race Padded Keyboard Wrist Rest - Stealth - Full Size - Regular",
              "currency": "CAD",
              "list_price": "",
              "price": 58.99,
              "shipping": "0.01",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=03q24303336384a4y2&tid=1&seq=1695082742&plt=ede8298d27cf505a9c74ec76a7cab230",
              "updated_t": 1662162037
            },
            {
              "merchant": "Newegg.com",
              "domain": "newegg.com",
              "title": "Glorious PC Gaming Race Padded Keyboard Wrist Rest - Stealth - Full Size - Regular",
              "currency": "",
              "list_price": "",
              "price": 46,
              "shipping": "0.01",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=z2x243z2y2237444w2&tid=1&seq=1695082742&plt=b78bef1ce33469c94920fadd0bb234f2",
              "updated_t": 1648600329
            },
            {
              "merchant": "Wal-Mart.com",
              "domain": "walmart.com",
              "title": "Glorious PC Gaming Race Padded Keyboard Wrist Rest - Stealth - Full Size - Regular",
              "currency": "",
              "list_price": 42.34,
              "price": 40.78,
              "shipping": "Free Shipping",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=z2u2y21303539484w2&tid=1&seq=1695082742&plt=4764adfcefc6ea7c620ca7e989bf5b09",
              "updated_t": 1663526507
            }
          ],
          "elid": "334573462079"
        }
      ]
    }`},
    { upc: '0194253012863', upcData: `{
      "code": "OK",
      "total": 1,
      "offset": 0,
      "items": [
        {
          "ean": "0194253012863",
          "title": "Apple Iphone Se 256gb Starlight",
          "description": "iPhone SE ? Love the Power. Love the Price.",
          "upc": "194253012863",
          "brand": "Apple",
          "model": "A5EB8960-A719-4EF4-8D60-4B9B90E51037",
          "color": "Other",
          "size": "",
          "dimension": "",
          "weight": "",
          "category": "Electronics",
          "currency": "",
          "lowest_recorded_price": 399,
          "highest_recorded_price": 771.99,
          "images": [
            "https://i5.walmartimages.com/asr/53dacfff-f910-4e81-894e-051b2f54234b.53ff120518d67a1632d81c5557b539f2.jpeg?odnHeight=450&odnWidth=450&odnBg=ffffff",
            "https://c1.neweggimages.com/ProductImageCompressAll640/75-113-755-V04.jpg",
            "https://img.grouponcdn.com/stores/4DPQVQcHZP23dhdAcv8UBEUcMYn3/storesoi52601499-3333x2000/v1/t460x279.jpg?p=1"
          ],
          "offers": [
            {
              "merchant": "Newegg.com",
              "domain": "newegg.com",
              "title": "Apple iPhone SE (2022) MMXD3LL/A 5G GSM/CDMA Cell Phone 4.7' Starlight 256GB 4GB RAM",
              "currency": "",
              "list_price": "",
              "price": 399,
              "shipping": "Free Shipping",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=03t2y2u2336384d4y2&tid=1&seq=1695082755&plt=528bd3a2a903d4052021889ecdbd14a9",
              "updated_t": 1676504400
            },
            {
              "merchant": "Wal-Mart.com",
              "domain": "walmart.com",
              "title": "Apple Iphone Se 256gb Starlight",
              "currency": "",
              "list_price": "",
              "price": 649.98,
              "shipping": "Free Shipping",
              "condition": "New",
              "availability": "Out of Stock",
              "link": "https://www.upcitemdb.com/norob/alink/?id=03w263z2w2x2d494r2&tid=1&seq=1695082755&plt=6ab580d7c822244049302e1a60e1eb69",
              "updated_t": 1690797293
            },
            {
              "merchant": "Verizon",
              "domain": "verizon.com",
              "title": "Apple iPhone SE (3rd Gen) 256GB in Starlight",
              "currency": "",
              "list_price": "",
              "price": 579.99,
              "shipping": "",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=03o2x2y233036444r2&tid=1&seq=1695082755&plt=1be799a9ec17aaa5360a154e3c232dfd",
              "updated_t": 1692674479
            },
            {
              "merchant": "Groupon",
              "domain": "Groupon",
              "title": "Apple iPhone SE in Red",
              "currency": "",
              "list_price": "",
              "price": 769.98,
              "shipping": "",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=03o2x2v213x2f474y2&tid=1&seq=1695082755&plt=ee9df5cd20c86172b5538601a308ebda",
              "updated_t": 1651360954
            }
          ]
        }
      ]
    }`},
    { upc: '0301872515174', upcData: `{
      "code": "OK",
      "total": 1,
      "offset": 0,
      "items": [
        {
          "ean": "0301872515174",
          "title": "CeraVe Ultra-Light Moisturizing Face Lotion with SPF 30  1.7 oz.",
          "description": "Developed with dermatologists CeraVe Ultra-Light Moisturizing Face Lotion with SPF 30 for normal to oily skin moisturizes with a matte finish & helps repair the protective skin barrier.",
          "upc": "301872515174",
          "brand": "CeraVe",
          "model": "30187251517",
          "color": "Stainless steel",
          "size": "",
          "dimension": "",
          "weight": "1.00lb",
          "category": "Health & Beauty > Personal Care > Cosmetics > Skin Care > Facial Cleansers",
          "currency": "",
          "lowest_recorded_price": 2,
          "highest_recorded_price": 75.96,
          "images": [
            "https://i5.walmartimages.com/asr/5d01fa51-1375-4034-a16e-920243f2de5c.4eb90a8c420e766b036ceba2a7f251af.jpeg?odnHeight=450&odnWidth=450&odnBg=ffffff",
            "https://target.scene7.com/is/image/Target/GUEST_acf188c1-69b5-4c75-9799-b64ae8567930?wid=1000&hei=1000",
            "https://pics.drugstore.com/prodimg/603536/450.jpg",
            "https://d29pz51ispcyrv.cloudfront.net/images/I/QrPGH72n3VIGGARPqVaKwgO.MD256.jpg",
            "https://jetimages.jetcdn.net/md5/8b91571fbeb5ca9d0831eae43edd2bd1.500"
          ],
          "offers": [
            {
              "merchant": "Walgreens",
              "domain": "walgreens.com",
              "title": "CeraVe Ultra Light Face Moisturizing Lotion with Broad Spectrum SPF 30 - 2 oz.",
              "currency": "",
              "list_price": "",
              "price": 16.99,
              "shipping": "US:::5.49 USD",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2x223t2w213a494z2&tid=1&seq=1695082815&plt=bbecf00a491d2bc357f2fcecc2c1b0c9",
              "updated_t": 1569798355
            },
            {
              "merchant": "Wal-Mart.com",
              "domain": "walmart.com",
              "title": "CeraVe Ultra-Light Moisturizing Face Lotion with SPF 30  1.7 oz.",
              "currency": "",
              "list_price": 29.94,
              "price": 25.61,
              "shipping": "Free Shipping",
              "condition": "New",
              "availability": "Out of Stock",
              "link": "https://www.upcitemdb.com/norob/alink/?id=y2o223t24313b464v2&tid=1&seq=1695082815&plt=4e1731cbd12b9a262075570a6873720a",
              "updated_t": 1692558986
            },
            {
              "merchant": "Target",
              "domain": "target.com",
              "title": "CeraVe Ultra-Light Face Lotion Moisturizer with Sunscreen - SPF 30 – 1.7oz",
              "currency": "",
              "list_price": "",
              "price": 16.99,
              "shipping": "",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2w213y2z223e444q2&tid=1&seq=1695082815&plt=634be403eed4022fe6a8c037abf6068a",
              "updated_t": 1684294544
            },
            {
              "merchant": "Jet.com",
              "domain": "jet.com",
              "title": "CeraVe Ultra-Light Moisturizing Lotion with Sunscreen SPF 30, 1.7 oz.",
              "currency": "",
              "list_price": "",
              "price": 14.44,
              "shipping": "",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=w2s223233303b494y2&tid=1&seq=1695082815&plt=4a3626480f501e967f481cb4793ae3ed",
              "updated_t": 1561998707
            },
            {
              "merchant": "MassGenie",
              "domain": "massgenie.com",
              "title": "CeraVe Face Moisturizer with SPF 30 / 1.7 Ounce / Light-Weight Face Lotion with Hyaluronic Acid / Fragrance Free",
              "currency": "",
              "list_price": 22.53,
              "price": 20.53,
              "shipping": "",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=x2p203x2x223c474r2&tid=1&seq=1695082815&plt=daa3b3a65908c5a10316c893556d30d5",
              "updated_t": 1695035067
            }
          ],
          "elid": "325652032344"
        }
      ]
    }`},
    { upc: '0097855084590', upcData: `{
      "code": "OK",
      "total": 1,
      "offset": 0,
      "items": [
        {
          "ean": "0097855084590",
          "title": "Logitech, LOG910003040, Anywhere Mouse MX, 1",
          "description": "Darkfield laser tracking delivers precise control on virtually any surfaceUnifying receiver allows simultaneous use with compatible devicesErgonomic design is comfortable in your hand wherever you are2.4 GHz technology offers fast data transmission and virtually no delaysPerfect for use on laminate tops, tray tables, glass and more",
          "upc": "097855084590",
          "brand": "Logitech",
          "model": "910-003040",
          "color": "Gold",
          "size": "",
          "dimension": "7 X 5.2X 2.8 inches",
          "weight": "0.6 Pounds",
          "category": "Electronics > Electronics Accessories > Computer Accessories > Mouse Pads",
          "currency": "",
          "lowest_recorded_price": 10.99,
          "highest_recorded_price": 5932,
          "images": [
            "http://c.shld.net/rpx/i/s/pi/mp/21875/3972939905?src=http%3A%2F%2Fimages.factoryadvantage.com%2Fcatalog%2Fproducts%2F111%2F1110728750%2Flarge.jpg&d=13d88d06b257a05419ffa0938ba6d121eabd1861",
            "https://www.officedepot.com/pictures/us/od/sk/lg/9909864_sk_lg.jpg",
            "https://i5.walmartimages.com/asr/2a80c283-2e3e-4d5a-bc52-c65d53b1489a_1.4e0ba432d17c2da877a323214cc72c29.jpeg?odnHeight=450&odnWidth=450&odnBg=ffffff",
            "https://c1.neweggimages.com/ProductImageCompressAll640/A0ZX_1_201610181483249797.jpg",
            "http://site.unbeatablesale.com/ISTR24658.JPG",
            "http://image1.cc-inc.com/prod/40266000/40266787_xlg.jpg",
            "http://www.mwave.com/mwave/specHR/images/BG37540.jpg",
            "http://www.techforless.com/cimages/361424.JPG",
            "https://tshop.r10s.com/947/4ec/f91a/72aa/a05f/cfb6/8ef3/114ee78bbd2c600c4290b6.jpg?_ex=512x512",
            "http://www.pcrush.com/images/180/1258902.jpg"
          ],
          "offers": [
            {
              "merchant": "Newegg.com",
              "domain": "newegg.com",
              "title": "Logitech Wireless Anywhere Mouse MX for PC and Mac - Brown Box",
              "currency": "",
              "list_price": "",
              "price": 179.99,
              "shipping": "0.01",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2o223z22333b474y2&tid=1&seq=1695082841&plt=a10f0145edec7b9cc7ec12db66375db6",
              "updated_t": 1648601135
            },
            {
              "merchant": "UnbeatableSale.com",
              "domain": "unbeatablesale.com",
              "title": "Logitech - Computer Accessories 910-003040 Wireless Anywhere Black Mouse MX with Unifying Receiver",
              "currency": "",
              "list_price": "",
              "price": 72.86,
              "shipping": "7.38",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2s233v21343c484q2&tid=1&seq=1695082841&plt=f73dfd46675eab238db2d175ded7fd57",
              "updated_t": 1560239416
            },
            {
              "merchant": "PCM",
              "domain": "pcm.com",
              "title": "Logitech 910-003040 MX ANYWHERE WIRELESS MOUSE (B2B)",
              "currency": "",
              "list_price": "",
              "price": 59.99,
              "shipping": "13.61",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2q2x2v2w2z2b4d4u2&tid=1&seq=1695082841&plt=4bbbe7552a5e04d9a6ed9b315cdd322e",
              "updated_t": 1538910774
            },
            {
              "merchant": "Sears",
              "domain": "sears.com",
              "title": "Logitech Wireless Anywhere Mouse MX for PC and Mac (910-003040)",
              "currency": "",
              "list_price": "",
              "price": 62.26,
              "shipping": "",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2q213y2v2339474&tid=1&seq=1695082841&plt=a73fa316b70de5206914ffa012061797",
              "updated_t": 1415762773
            },
            {
              "merchant": "MacMall",
              "domain": "macmall.com",
              "title": "Logitech 910-003040 MX ANYWHERE WIRELESS MOUSE (B2B)",
              "currency": "",
              "list_price": "",
              "price": 59.99,
              "shipping": "Free Shipping",
              "condition": "New",
              "availability": "Out of Stock",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2q2x2z213z2e474x2&tid=1&seq=1695082841&plt=2fbbad8447d6ef9768432f8f2b8caf79",
              "updated_t": 1541315451
            },
            {
              "merchant": "Office Depot",
              "domain": "officedepot.com",
              "title": "Logitech Anywhere Mouse MX - Laser - Wireless - Radio Frequency - USB - Scroll Wheel",
              "currency": "",
              "list_price": "",
              "price": 78.79,
              "shipping": "Free Shipping",
              "condition": "New",
              "availability": "Out of Stock",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2w2z2y203137484y2&tid=1&seq=1695082841&plt=d94cf55340de3a0f6fecb7e09f873d5f",
              "updated_t": 1546153442
            },
            {
              "merchant": "Mwave",
              "domain": "mwave.com",
              "title": "Logitech 910-003040 Anywhere Mouse MX - Laser - Wireless - Radio Frequency - USB - Scroll Wheel",
              "currency": "",
              "list_price": 62.73,
              "price": 61.46,
              "shipping": "",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2q203u2231384c4v2&tid=1&seq=1695082841&plt=b4fbfd170c05602e7c235db87d4a16d4",
              "updated_t": 1498241820
            },
            {
              "merchant": "Tech For Less",
              "domain": "techforless.com",
              "title": "Logitech LOG910003040 Anywhere MX Wireless Mouse - Black",
              "currency": "",
              "list_price": 39.89,
              "price": 34.97,
              "shipping": "Free Shipping",
              "condition": "New",
              "availability": "Out of Stock",
              "link": "https://www.upcitemdb.com/norob/alink/?id=w2x2y2w21333a464s2&tid=1&seq=1695082841&plt=f5c998ef400b3e9f2625c8912bc168d4",
              "updated_t": 1557733193
            },
            {
              "merchant": "Rakuten(Buy.com)",
              "domain": "rakuten.com",
              "title": "Logitech Anywhere Mouse MX - Laser - Wireless - Radio Frequency - USB - Scroll Wheel",
              "currency": "",
              "list_price": "",
              "price": 80.6,
              "shipping": "",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=x2t243t223038444&tid=1&seq=1695082841&plt=96bef431aead4ac21f82effd22262844",
              "updated_t": 1563719891
            },
            {
              "merchant": "pcRUSH.com",
              "domain": "pcrush.com",
              "title": "Anywhere Mouse MX",
              "currency": "",
              "list_price": "",
              "price": 52.45,
              "shipping": "9.77",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2o223030303b444r2&tid=1&seq=1695082841&plt=7c6787b43ea2bb09581abfdf9d5193f5",
              "updated_t": 1499806813
            },
            {
              "merchant": "Wal-Mart.com",
              "domain": "walmart.com",
              "title": "Logitech, LOG910003040, Anywhere Mouse MX, 1",
              "currency": "",
              "list_price": "",
              "price": 99.99,
              "shipping": "Free Shipping",
              "condition": "New",
              "availability": "Out of Stock",
              "link": "https://www.upcitemdb.com/norob/alink/?id=w2o213v2y213a4a4y2&tid=1&seq=1695082841&plt=9e52dcbdd64d9d99978e9a4affa852a6",
              "updated_t": 1642414424
            },
            {
              "merchant": "TigerDirect",
              "domain": "tigerdirect.com",
              "title": "Logitech MX ANYWHERE WIRELESS MOUSE (B2B)",
              "currency": "",
              "list_price": "",
              "price": 65.99,
              "shipping": "",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2t22313v233e464r2&tid=1&seq=1695082841&plt=69a44fbbb3d45710e86073a2d160a77b",
              "updated_t": 1557391679
            },
            {
              "merchant": "TigerDirect Canada",
              "domain": "tigerdirect.ca",
              "title": "Logitech MX ANYWHERE WIRELESS MOUSE (B2B)",
              "currency": "",
              "list_price": "",
              "price": 70.99,
              "shipping": "",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=w2w203v2w213a4d4r2&tid=1&seq=1695082841&plt=a311b83850fbb23a1023fa79cdd13e98",
              "updated_t": 1552551684
            },
            {
              "merchant": "Newegg Canada",
              "domain": "newegg.ca",
              "title": "Logitech Anywhere Mouse MX",
              "currency": "CAD",
              "list_price": "",
              "price": 80.67,
              "shipping": "",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2o24323z2z28484t2&tid=1&seq=1695082841&plt=50bb2e7b6cd1d321714bbe3c68424278",
              "updated_t": 1553931875
            },
            {
              "merchant": "Newegg Business",
              "domain": "neweggbusiness.com",
              "title": "Logitech Anywhere Mouse MX",
              "currency": "",
              "list_price": "",
              "price": 79.12,
              "shipping": "10.00",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2o263t2y243e4b4q2&tid=1&seq=1695082841&plt=17f4809be106023c485978b8bfc515a6",
              "updated_t": 1526489753
            },
            {
              "merchant": "Bulk Office Supplies",
              "domain": "bulkofficesupply.com",
              "title": "Logitech Anywhere Mouse MX",
              "currency": "",
              "list_price": "",
              "price": 70.34,
              "shipping": "",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=w2w233x2z243e4c4y2&tid=1&seq=1695082841&plt=f39cab8c6083427b1d2346d85648b2a4",
              "updated_t": 1542106548
            },
            {
              "merchant": "Jet.com",
              "domain": "jet.com",
              "title": "Logitech Anywhere Mouse MX Brown Box",
              "currency": "",
              "list_price": "",
              "price": 74.62,
              "shipping": "",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=w2v2z2z2v223f4c4r2&tid=1&seq=1695082841&plt=ea73547a15b58e84ca081458468d8aff",
              "updated_t": 1562000411
            }
          ],
          "asin": "B0082D5660",
          "elid": "323450165193"
        }
      ]
    }`},
    { upc: '0049705541944', upcData: `{
      "code": "OK",
      "total": 1,
      "offset": 0,
      "items": [
        {
          "ean": "0049705541944",
          "title": "2015 Newest Microsoft Surface Pro 4 Core i5-6300U 4G 128GB 12.3\" touch screen with 2736x1824 3K QHD Windows 10 Pro Multi-position Kickstand (Black Cover Bundle)",
          "description": "Microsoft Surface Pro 4 Tablet: The powerful Intel Core i5-6300U processor makes it easy to stay productive on the go. Tap and touch the vivid 12.3\\\" HD touch screen using the Surface Pen, or connect to the Web to read the news or watch your favorite TV shows.Windows 10 ProWindows 10 brings back the Start Menu from Windows 7 and introduces new features, like the Edge Web browser that lets you markup Web pages on your screen. Learn more >12.3\\\" PixelSense touch screen with 2736 x 1824 resolutionHigh pixel d...",
          "upc": "049705541944",
          "brand": "Microsoft",
          "model": "Surface Pro 4",
          "color": "Gold",
          "size": "",
          "dimension": "11.5 X 7.9 X 0.4 inches",
          "weight": "1.7 Pounds",
          "category": "Electronics > Computers > Tablet Computers",
          "currency": "",
          "lowest_recorded_price": 579.99,
          "highest_recorded_price": 899,
          "images": [
            "https://i5.walmartimages.com/asr/e10b47f4-d3d4-4660-8b14-b3d13310bfc9_1.f4320ff35dc9c336dab18f0e07e36a73.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF",
            "http://images10.newegg.com/ProductImageCompressAll200/A6V6_131214689502872005OoIY3oN5Ub.jpg",
            "http://img1.r10.io/PIC/103637462/0/1/250/103637462.jpg"
          ],
          "offers": [
            {
              "merchant": "Newegg.com",
              "domain": "newegg.com",
              "title": "Microsoft Surface Pro 4 Core i5-6300U 4G 128GB 12.3\" touch screen w/ 2736x1824 3K 3:2 QHD Windows 10 Pro (Black Cover Bundle)",
              "currency": "",
              "list_price": "",
              "price": 979.99,
              "shipping": "Free Shipping",
              "condition": "New",
              "availability": "Out of Stock",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2p2z2x20363c444w2&tid=1&seq=1695082872&plt=4f69ff4ea7017d1e3fea1461914a3c37",
              "updated_t": 1479212033
            },
            {
              "merchant": "Rakuten(Buy.com)",
              "domain": "rakuten.com",
              "title": "2015 Newest Microsoft Surface Pro 4 Core i5 6300U 4G 128GB 12.3 touch screen w 2736x1824 3K 3 2 QH",
              "currency": "",
              "list_price": "",
              "price": 1319,
              "shipping": "Free Shipping",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=u2t223w20363b464s2&tid=1&seq=1695082872&plt=84f5ae2f8d6254131880d8d70f6d6d3f",
              "updated_t": 1462031934
            },
            {
              "merchant": "Walmart Marketplace",
              "domain": "walmart.com",
              "title": "2015 Newest Microsoft Surface Pro 4 Core i5-6300U 4G 128GB 12.3\" touch screen with 2736x1824 3K QHD Windows 10 Pro Multi-position Kickstand (Black Cover Bundle)",
              "currency": "",
              "list_price": 1105.77,
              "price": 899,
              "shipping": "0",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=w2t243030323d454z2&tid=1&seq=1695082872&plt=46c6e6358d719b25142e58b5b94aa671",
              "updated_t": 1543242112
            },
            {
              "merchant": "Newegg Canada",
              "domain": "newegg.ca",
              "title": "Microsoft Surface Pro 4 Core i5-6300U 4G 128GB 12.3\" touch screen w/ 2736x1824 3K 3:2 QHD Windows 10 Pro (Black Cover Bundle)",
              "currency": "CAD",
              "list_price": "",
              "price": 1477.46,
              "shipping": "",
              "condition": "New",
              "availability": "",
              "link": "https://www.upcitemdb.com/norob/alink/?id=v2q2z2w2x263a484s2&tid=1&seq=1695082872&plt=426f8f149ed5496c190ab19b31025aeb",
              "updated_t": 1483215317
            }
          ],
          "asin": "B017GUP4M0",
          "elid": "323614091043"
        }
      ]
    }`}
  ]

  return valid_products[Math.floor(Math.random()*valid_products.length)];
}

module.exports = {
  generateValidUPC
}