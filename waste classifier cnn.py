import numpy as np
%matplotlib inline
import matplotlib.pyplot as plt
import cv2

import tensorflow as tf
import keras
from keras.models import Sequential, load_model
from keras.layers import Dense, Conv2D, MaxPooling2D, Flatten, Dropout
from keras.losses import categorical_crossentropy
from keras.optimizers import adam, sgd
from keras.preprocessing.image import ImageDataGenerator
from keras.callbacks import ModelCheckpoint

from PIL import Image

train_path = '/content/gdrive/My Drive/waste_classification/TRAIN'
test_path = '/content/gdrive/My Drive/waste_classification/TEST'
IMG_BREDTH = 200
IMG_HEIGHT = 200
num_classes =

train_batch = ImageDataGenerator(featurewise_center=False,
                                 samplewise_center=False, 
                                 featurewise_std_normalization=False, 
                                 samplewise_std_normalization=False, 
                                 zca_whitening=False, 
                                 rotation_range=45, 
                                 width_shift_range=0.2, 
                                 height_shift_range=0.2, 
                                 horizontal_flip=True, 
                                 vertical_flip=False).flow_from_directory(train_path, 
                                                                          target_size=(IMG_HEIGHT, IMG_BREDTH), 
                                                                          classes=['Organic', 'Recycle'], 
                                                                          batch_size=100)

test_batch = ImageDataGenerator().flow_from_directory(test_path, 
                                                      target_size=(IMG_HEIGHT, IMG_BREDTH), 
                                                      classes=['Organic', 'Recycle'], 
                                                      batch_size = 100)


def cnn_model():
    
    model = Sequential()

    model.add(Conv2D(32, kernel_size=(3, 3), padding='same', activation='relu', input_shape=(IMG_HEIGHT,IMG_BREDTH,3)))
    model.add(Conv2D(32, kernel_size=(3, 3), activation='relu'))
    model.add(Conv2D(32, kernel_size=(3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.25))

    model.add(Conv2D(64, kernel_size=(3, 3), activation='relu'))
    model.add(Conv2D(64, kernel_size=(3, 3), activation='relu'))
    model.add(Conv2D(64, kernel_size=(3, 3), activation='relu'))
    model.add(Dropout(0.25))
    
    model.add(Flatten())

    model.add(Dense(512, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(512, activation='relu'))
    model.add(Dropout(0.5))

    model.add(Dense(num_classes, activation='softmax'))
              
    model.summary()

    return model

def use_model(path):
    
    model = load_model('waste_classifier.h5')
    pic = plt.imread(path)
    pic = cv2.resize(pic, (IMG_BREDTH, IMG_HEIGHT))
    pic = np.expand_dims(pic, axis=0)
    classes = model.predict_classes(pic)
    return classes
    
#     code using PIL
#     model = load_model('best_waste_classifier.h5')
#     pic1 = plt.imread(path)
#     pic = Image.open(path).resize((IMG_BREDTH, IMG_HEIGHT))
#     plt.imshow(pic1)
#     if model.predict_classes(np.expand_dims(pic, axis=0)) == 0:
#         classes = 'ORGANIC'
#     elif model.predict_classes(np.expand_dims(pic, axis=0)) == 1:
#         classes = 'RECYCLABLE'

model = cnn_model()


checkpoint = ModelCheckpoint('waste_classifier.h5', 
                             monitor='val_loss', 
                             verbose=0, 
                             save_best_only=True, 
                             mode='auto')



model.compile(loss='categorical_crossentropy', optimizer=adam(lr=1.0e-4), metrics=['accuracy'])

model = model.fit_generator(train_batch,  
                             validation_data=test_batch,  
                             epochs=10, 
                             verbose=1, 
                             callbacks=[checkpoint])

model.save('wc1.h5')


    
     
