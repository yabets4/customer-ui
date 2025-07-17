import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LeadDetail from "./LeadDetail";

// Dummy leads data
const dummyLeads = [
  {
    id: "1",
    full_name: "Acme Inc.",
    email: "info@acme.com",
    phone: "123-456-7890",
    type: "Business",
    score: 72,
    source: "Web Form",
    created_at: "2025-07-01T10:00:00.000Z",
    tags: ["Interested", "VIP"],
    activities: [
      {
        type: "call",
        description: "Initial discovery call completed.",
        timestamp: "2025-07-08T14:15:00.000Z",
      },
    ],
  },
  {
    id: "2",
    full_name: "John Doe",
    email: "john@example.com",
    phone: "555-1234",
    type: "Individual",
    score: 45,
    source: "Referral",
    created_at: "2025-07-03T09:00:00.000Z",
    tags: ["Cold"],
    activities: [],
  },
];

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);

  useEffect(() => {
    // Simulate fetching from backend or state
    const found = dummyLeads.find((l) => l.id === id);
    setLead(found);
  }, [id]);

  return (
    <LeadDetail
      lead={lead}
      onClose={() => navigate("/crm/leadlist")}
      onSaveActivity={(activity) =>
        console.log("Activity saved for lead:", id, activity)
      }
    />
  );
}
