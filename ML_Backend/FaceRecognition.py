import face_recognition
import cv2
import numpy as np

# Load a sample picture and learn how to recognize it.
samarth_image = face_recognition.load_image_file("samarth1.jpg")
samarth_face_encoding = face_recognition.face_encodings(samarth_image)[0]

vatsal_image = face_recognition.load_image_file("vatsal.jpg")
vatsal_face_encoding = face_recognition.face_encodings(vatsal_image)[0]

ritika_image = face_recognition.load_image_file("ritika.jpg")
ritika_face_encoding = face_recognition.face_encodings(ritika_image)[0]

manasa_image = face_recognition.load_image_file("manasa.jpg")
manasa_face_encoding = face_recognition.face_encodings(manasa_image)[0]

ajay_image = face_recognition.load_image_file("ajay.jpg")
ajay_face_encoding = face_recognition.face_encodings(ajay_image)[0]


# Create arrays of known face encodings and their names
known_face_encodings = [
    samarth_face_encoding,
    vatsal_face_encoding,
    ritika_face_encoding,
    manasa_face_encoding,
    ajay_face_encoding
]
known_face_names = [
    "Samarth",
    "Vatsal",
    "Ritika",
    "Manasa",
    "Ajay"
]

# Initialize some variables
face_locations = []
face_encodings = []
face_names = []
process_this_frame = True

def detect(frame):
    # Grab a single frame of video
    # Resize frame of video to 1/4 size for faster face recognition processing
    
    small_frame = cv2.resize(frame, None, fx=0.5, fy=0.5)

    # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
    rgb_small_frame = small_frame[:, :, ::-1]

    # Only process every other frame of video to save time
    if process_this_frame:
        # Find all the faces and face encodings in the current frame of video
        face_locations = face_recognition.face_locations(rgb_small_frame)
        face_encodings = face_recognition.face_encodings(rgb_small_frame, face_locations)

        face_names = []
        for face_encoding in face_encodings:
            # See if the face is a match for the known face(s)
            matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
            name = "Unknown"

            # # If a match was found in known_face_encodings, just use the first one.
            # if True in matches:
            #     first_match_index = matches.index(True)
            #     name = known_face_names[first_match_index]

            # Or instead, use the known face with the smallest distance to the new face
            face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
            best_match_index = np.argmin(face_distances)
            if matches[best_match_index]:
                name = known_face_names[best_match_index]

            face_names.append(name)

    process_this_frame = not process_this_frame
    return face_names[0][:-4]
    