"use client";

import { useState, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const TERMS_CONTENT = `DANU Booking
Terms and Conditions
These Guidelines and Regulations govern the use of the Danu Booking platform ("Danu") and the purchase of transportation tickets through our website, mobile application, call center, or authorized agents.

By purchasing a ticket through Danu, you agree to the following terms:

1. TICKET SELECTION & PAYMENT
  1.1 It is the passenger's responsibility to correctly select:
    • Departure and arrival locations
    • Travel date and time
    • Preferred bus operator
    • Seat number
    • Full legal name (as shown on government-issued ID)
    • Accurate contact information (phone number and address)

All personal details must be entered correctly before proceeding with payment. Danu is not responsible for issues arising from incorrect passenger information.

  1.2 Available payment methods include:
    • Telebirr
    • CBE Birr
    • Cash payments through authorized agents or ticket offices

  1.3 A ticket is considered confirmed only after full payment has been successfully verified.

2. CANCELLATIONS & REFUND POLICY
  2.1 Ticket Cancellation Before Travel Date
    Passengers who cancel their ticket before the travel date may request a refund of 50% of the total fare paid, provided that:
    • The request is made within five (5) consecutive days, including the travel date
    • The passenger presents a valid government-issued ID at the ticket office

2.2 Late Arrival (Missed Departure)
    Passengers who arrive after the scheduled departure time may request a 50% refund within five (5) consecutive days, including the travel date, by presenting their ID at the ticket office.

2.3 Refund Request Deadline
    All refund requests must be made within five (5) consecutive days from the travel departure date. Requests submitted after this period will not be considered.

2.4 Passengers must provide their full name, address, and accurate contact information at the time of purchase in order to qualify for any refund.

3. TICKET TRANSFER
    3.1 Tickets purchased through authorized ticket offices may be transferred to another passenger before departure, subject to operator approval and identity verification.

    3.2 If similar tickets are reported cancelled within 24 hours and meet refund eligibility requirements, the cost of the same ticket may be refunded according to the applicable refund policy.

4. BOARDING REQUIREMENTS
4.1 Passengers must present:
    • Their electronic ticket (SMS confirmation, QR code, or booking reference) or printed ticket, and
    • A valid government-issued ID

when requested by bus staff, conductors, or authorized personnel.

4.2 If the passenger cannot present the electronic or printed ticket, identity verification may be conducted using the government-issued ID and booking reference number, subject to confirmation in the Danu system.

4.3 Boarding will only be permitted if the ticket is successfully verified in the Danu system. Tickets that cannot be verified will be considered invalid.

4.4 Printed tickets must remain clear and legible. Danu is not responsible for denied boarding due to damaged, altered, or unreadable printed tickets.

5. LUGGAGE POLICY
  5.1 Each passenger is allowed to carry:
        • One bag weighing up to 25 kilograms free of charge

5.2 Bags exceeding 25 kilograms will be subject to additional charges in accordance with the bus operator's regulations.

5.3 Passengers must:
    • Ensure luggage is properly tagged
    • Retain the luggage tag until arrival
    • Obtain a receipt when paying for excess baggage

5.4 Danu and its partner bus companies are not responsible for:
    • Unlabeled luggage
    • Improperly packaged items
    • Hand-carried valuables such as electronic devices, jewelry, laptops, cameras, or cash

6. CHILDREN POLICY
  6.1 Children aged seven (7) years and under may travel free of charge provided they do not occupy a separate seat.

6.2 If a seat is required, a full or discounted fare (as determined by the bus operator) will apply.

7. PROHIBITED ITEMS
The following items are strictly prohibited on all journeys:
    • Weapons of any kind
    • Flammable or explosive materials
    • Illegal or prohibited drugs
    • Poorly packaged goods
    • Strongly odorous or hazardous items

Passengers found carrying prohibited items may be denied boarding without refund and may be reported to the appropriate authorities.

8. LIMITATION OF RESPONSIBILITY
  8.1 Danu Booking operates solely as a digital ticketing platform connecting passengers with licensed bus operators.

  8.2 Danu is not the operator of transportation services and does not own, manage, or control buses.

  8.3 Danu shall not be responsible for:
    • Delays
    • Accidents
    • Route changes
    • Service interruptions
    • Loss or damage of personal belongings
    • Passenger conduct or behavior

  8.4 All transportation services are provided by third-party bus operators. Any disputes related to travel services shall be handled in accordance with the bus operator's policies and applicable Ethiopian law.

9. GOVERNING LAW
    These Guidelines and Regulations shall be governed by and interpreted in accordance with the laws of the Federal Democratic Republic of Ethiopia and applicable regulations issued by the Ministry of Transport and Logistics.`;

interface TermsConditionsModalProps {
  read: boolean;
  setOnRead: (read: boolean) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function TermsConditionsModal({
  read,
  setOnRead,
  isOpen,
  onClose,
}: TermsConditionsModalProps) {
  if (!isOpen) return null;
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    const el = contentRef.current;
    if (!el) return;

    const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5; // small tolerance

    if (isBottom) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Modal */}
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">
            Terms & Conditions
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-6 py-4"
        >
          <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed space-y-4">
            {TERMS_CONTENT.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
          <Button
            onClick={() => {
              onClose();
              setOnRead(true);
            }}
            disabled={!hasScrolledToBottom}
            className="bg-teal-600 hover:bg-teal-700 text-white font-medium"
          >
            I Understand
          </Button>
        </div>
      </div>
    </div>
  );
}
