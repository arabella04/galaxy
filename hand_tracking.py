import cv2
import mediapipe as mp

# Initialize MediaPipe Hands and drawing utilities
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

# Setup hand detection module
# max_num_hands=2 allows it to detect both hands simultaneously
hands = mp_hands.Hands(
    max_num_hands=2, min_detection_confidence=0.7, min_tracking_confidence=0.7
)

# Start webcam capture (0 is usually the default built-in laptop camera)
cap = cv2.VideoCapture(0)

print("Press 'q' to quit the program.")

while cap.isOpened():
    success, frame = cap.read()
    if not success:
        print("Ignoring empty camera frame.")
        continue

    # Flip the frame horizontally for a natural selfie-view (mirror effect)
    frame = cv2.flip(frame, 1)

    # Convert BGR image to RGB (MediaPipe requires RGB)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Process the frame and detect hands
    results = hands.process(rgb_frame)

    # Get frame dimensions to calculate pixel coordinates
    h, w, c = frame.shape

    # Check if any hands are detected
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # 1. Draw the standard MediaPipe hand skeleton landmarks and connections
            mp_drawing.draw_landmarks(
                frame, hand_landmarks, mp_hands.HAND_CONNECTIONS
            )

            # 2. Extract specific landmarks to draw custom "control" lines
            # Wrist is landmark 0
            wrist = hand_landmarks.landmark[0]
            cx_wrist, cy_wrist = int(wrist.x * w), int(wrist.y * h)

            # Fingertip landmark IDs: Thumb(4), Index(8), Middle(12), Ring(16), Pinky(20)
            fingertip_ids = [4, 8, 12, 16, 20]

            for tip_id in fingertip_ids:
                tip = hand_landmarks.landmark[tip_id]
                cx_tip, cy_tip = int(tip.x * w), int(tip.y * h)

                # Draw a custom line from the wrist to each fingertip
                # cv2.line(image, start_point, end_point, color(BGR), thickness)
                cv2.line(
                    frame,
                    (cx_wrist, cy_wrist),
                    (cx_tip, cy_tip),
                    (0, 255, 0),
                    2,
                )

                # Draw a glowing circle on the fingertips for effect
                cv2.circle(frame, (cx_tip, cy_tip), 6, (0, 0, 255), -1)

    # Display the resulting frame
    cv2.imshow("Hand Control Tracker", frame)

    # Break the loop when 'q' key is pressed
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

# Clean up and close windows
cap.release()
cv2.destroyAllWindows()