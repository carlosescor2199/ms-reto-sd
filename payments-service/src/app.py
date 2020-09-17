from flask import Flask, jsonify, request, Response
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson import json_util
from bson.objectid import ObjectId
import json
import stripe
import requests
from responses import Resp

app = Flask(__name__)

cors = CORS(app)

app.config['MONGO_URI'] = "mongodb+srv://admin:admin@cluster0.v1isk.azure.mongodb.net/microservices-reto?retryWrites=true&w=majority"

mongo = PyMongo(app)

stripe.api_key = "sk_test_51HQH5UK4oBzGA7axt4HmOnviDSSpdmFMrYRtEgsv96fgu1LppyE7InCdpx6iuLSDRhkWbFSTIMr4MVfR7hiSflD600fopNOgQ3"

YOUR_DOMAIN = 'http://localhost:8080/'

@app.route('/', methods=["GET"])
def hello():
    return jsonify({"message": "Hola"})

@app.route('/payments', methods=["POST"])
def pay_one_product():
    id_product = request.json["id_product"]
    quantity = request.json["quantity"]
    url = "http://172.17.0.2:4000/users/validate"
    
    res = requests.get(url, headers = {"authorization": str(request.headers["authorization"])})

    data = str(res.json()).replace("'", '"')

    response = Resp(data)

    if hasattr(response , 'errors'):
        return res.json()

    user = res.json()

    product = mongo.db.products.find_one({'_id': ObjectId(id_product)})

    if not product:
        res = jsonify({'error': 'No existe este producto'})
        res.status_code = 200
        return res

    price = int(product['price'])*100

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': 'usd',
                        'unit_amount': price,
                        'product_data': {
                            'name': product['name'],
                            'images': [product['imageURL']],
                        },
                    },
                    'quantity': quantity,
                },
            ],
            mode='payment',
            success_url=YOUR_DOMAIN + '?success=true',
            cancel_url=YOUR_DOMAIN + '?canceled=true',
        )
        return jsonify({'id': checkout_session.id})
    except Exception as e:
        return jsonify(error=str(e)), 403


@app.route('/payments/cart', methods=["POST"])
def pay_cart_products():
    items=[]
    products = request.json["products"]

    url = "http://172.17.0.2:4000/users/validate"
    
    res = requests.get(url, headers = {"authorization": str(request.headers["authorization"])})


    data = str(res.json()).replace("'", '"')

    response = Resp(data)

    if hasattr(response , 'errors'):
        return res.json()

    user = res.json()

    for product in products:
        id_product = product['id_product']
        resProduct = mongo.db.products.find_one({'_id': ObjectId(id_product)})
        if not resProduct:
            res = jsonify({'error': 'No existe este producto'})
            res.status_code = 200
            return res
        
        price = int(resProduct['price'])*100
        item = {
        'price_data': {
            'currency': 'usd',
            'unit_amount': price,
            'product_data': {
                'name': resProduct['name'],
                'images': [resProduct['imageURL']],
            },
        },
        'quantity': product['quantity'],
        }

        items.append(item)

    

    try:
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=items,
            mode='payment',
            success_url=YOUR_DOMAIN + '?success=true',
            cancel_url=YOUR_DOMAIN + '?canceled=true',
        )
        return jsonify({'id': checkout_session.id})
    except Exception as e:
        return jsonify(error=str(e)), 403


@app.errorhandler(404)
def not_found(error=None):
    message = {
        'message': 'Resource Not Found ' + request.url,
        'status': 404
    }
    response = jsonify(message)
    response.status_code = 404
    return response


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)