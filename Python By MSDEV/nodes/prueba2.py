import datetime
import hashlib 
import json
from flask import Flask, jsonify, request
import requests 
from uuid import uuid4
from urllib.parse import urlparse
import cryptocode
from flask_cors import CORS


#Paso 1 - Armando el BlockChain

class Blockchain:
    def __init__(self):
        self.chain = []
        self.patient = {'nombre': "genesis block"}
        self.create_block(proof=1, previous_hash='0')
        self.nodes = set()
        
    def add_node(self, address):
        parsed_url = urlparse(address)
        self.nodes.add(parsed_url.netloc)
        
    def replace_chain(self):
        network = self.nodes
        longest_chain = None
        max_length = len(self.chain)
        
        for node in network:
            response = requests.get(f'http://{node}/get_chain')
            if response.status_code == 200:
                data = response.json()
                length = data['length']
                chain = data['chain']
                
                if length>max_length and self.is_chain_valid(chain):
                    max_length = length
                    longest_chain = chain
            if longest_chain:
                self.chain = longest_chain
                return True
            return False
    
    def create_block(self, proof, previous_hash):
        block = {'index':len(self.chain)+1,
                 'timestamp':str(datetime.datetime.now()),
                 'proof': proof,
                 'previous_hash': previous_hash,
                 'patient': self.patient}
        self.patient = {}
        self.chain.append(block)
        
        return block
    def add_patient(self, nombre, semanas_emb, edad, tipo_emb, tipo_sangre, padecimientos, fecha_primera_cita, fecha_alivio, clave):
        if nombre==None:
            nombre = "0"
        self.patient = {'nombre': nombre,
                        'semanas_emb': cryptocode.encrypt(semanas_emb,clave),
                        'edad': cryptocode.encrypt(edad,clave),
                        'tipo_emb': cryptocode.encrypt(tipo_emb,clave),
                        'tipo_sangre': cryptocode.encrypt(tipo_sangre,clave),
                        'padecimientos': cryptocode.encrypt(padecimientos,clave),
                        'fecha_primera_cita': cryptocode.encrypt(fecha_primera_cita,clave),
                        'fecha_alivio': cryptocode.encrypt(fecha_alivio,clave),}
        previous_block = self.get_previous_block()
        return previous_block['index']+1
        

    def get_previous_block(self):
        return self.chain[-1]
    
    def proof_of_work(self,previous_proof):
        new_proof = 1
        check_proof = False
        
        while check_proof is False:
            hash_operation = hashlib.sha256(str(new_proof**2 - previous_proof**2).encode()).hexdigest()

            if hash_operation[:4]=='0000':
                check_proof = True
            else:
                new_proof += 1
            return new_proof
        
    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()
    
    def is_chain_valid(self, chain):
        previous_block = chain[0]
        block_index = 1
        while block_index < len(chain):
            block = chain[block_index]
            if block['previous_hash'] != self.hash(previous_block):
                return False
            previous_proof = previous_block['proof']
            proof = block['proof']
            hash_operation = hashlib.sha256(str(proof**2 - previous_proof**2).encode()).hexdigest()
        
            if hash_operation[:4]=='0000':
                return False
            
            previous_block = block
            block_index += 1
        return True
            
    
app = Flask(__name__)
CORS(app)

node_address = str(uuid4()).replace('-', '')


blockchain = Blockchain()

@app.route('/mine_block', methods=['GET'])

def mine_block():
    previous_block = blockchain.get_previous_block()
    previous_proof = previous_block['proof']
    proof = blockchain.proof_of_work(previous_proof)
    previous_hash = blockchain.hash(previous_block)
    
    #blockchain.add_patient(curp = node_address, padecimientos = 'Gen', nombre = "a", clave="asda")
    
    block = blockchain.create_block(proof, previous_hash)
    response = {'message': 'minaste, gg bro',
                'index': block['index'],
                'timestamp': block['timestamp'],
                'proof': block['proof'],
                'previous_hash': block['previous_hash'],
                'patient': block['patient']}
    return jsonify(response), 200


@app.route('/get_chain', methods=['GET'])
        
def get_chain():
    response = {'chain':blockchain.chain,
                'length':len(blockchain.chain)}
    return jsonify(response), 200


@app.route('/is_valid', methods=['GET'])

def is_valid():
    is_valid = blockchain.is_chain_valid(blockchain.chain)
    if is_valid:
        response = {'message': 'El Blockchain es valido'}
    else:
        response = {'message': 'Algo salio mal. El Blockchain no es valido'}
    return jsonify(response), 200



#añadiendo nueva transaccion al blockchain

@app.route('/add_patient', methods=['POST'])

def add_patient():
    json = request.get_json()
    transaction_keys = ['nombre', 'semanas_emb', 'edad', 'tipo_emb', 'tipo_sangre', 'padecimientos', 'fecha_primera_cita', 'fecha_alivio', 'clave']
    
    if not all (key in json for key in transaction_keys):
        return 'algun elemento del proceso esta faltando', 400
    
    index = blockchain.add_patient(json['nombre'], json['semanas_emb'], json['edad'], json['tipo_emb'], json['tipo_sangre'], json['padecimientos'], json['fecha_primera_cita'], json['fecha_alivio'], json['clave'])
    response = {'message': f'la informacion sera añadida al bloque numero {index}'}
    return jsonify(response), 201

#descentralizando el blockchain - conectando nuevos nodos

@app.route('/connect_node', methods=['POST'])

def connect_node():
    json = request.get_json()
    nodes = json.get('nodes')
    if nodes is None:
        return 'no  node', 401
    for node in nodes:
        blockchain.add_node(node)
    response = {'message': 'Todos los nodos estan ahora conectados. Nodos: ',
                'nodes': list(blockchain.nodes)}
    return jsonify(response), 201


#remplazand la cadena por la mas larga
@app.route('/replace_chain', methods=['GET']) 

def replace_chain():
    is_chain_replace = blockchain.replace_chain()
    
    if is_chain_replace:
        response = {'message': 'los nodos eran diferentes. La cadena fue actualizada',
                    'new_chain': blockchain.chain}
    else:
        response = {'message': 'La cadena no se encuentra desactualizada',
                    'actual_chain': blockchain.chain}
    return jsonify(response), 200

@app.route('/search', methods=['POST'])

def search():
    json = request.get_json()
    patient_keys = ['nombre', 'clave']
    
    if not all (key in json for key in patient_keys):
        return 'algun elemento del proceso esta faltando', 400

    response=[]
    for block in blockchain.chain:
        patient = block['patient']
        
        if json['nombre'] == patient['nombre']:
            data = {'nombre': patient['nombre'],
                    'semanas_emb': cryptocode.decrypt(patient['semanas_emb'], json['clave']),
                    'edad': cryptocode.decrypt(patient['edad'], json['clave']),
                    'tipo_emb': cryptocode.decrypt(patient['tipo_emb'], json['clave']),
                    'tipo_sangre': cryptocode.decrypt(patient['tipo_sangre'], json['clave']),
                    'padecimientos': cryptocode.decrypt(patient['padecimientos'], json['clave']),
                    'fecha_primera_cita': cryptocode.decrypt(patient['fecha_primera_cita'], json['clave']),
                    'fecha_alivio': cryptocode.decrypt(patient['fecha_alivio'], json['clave'])}
            response.append(data)
        
        
    return jsonify(response), 201

@app.route('/get_nodos', methods=['GET'])

def get_nodos():
    response = {'nodes': list(blockchain.nodes)}
    return jsonify(response), 200


#corre la app

app.run(host='0.0.0.0', port='5006')
        
        
        
        
        
        
        
        
        
        
        