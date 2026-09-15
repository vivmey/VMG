🎯 Standard Format (With All Elements)

  specialty-serviceType-audience-language-[location]-variant

  📐 Component Breakdown

  | Position | Component   | Required    | Values                                                                                                                     | Example       |
  |----------|-------------|-------------|----------------------------------------------------------------------------------------------------------------------------|---------------|
  | 1        | specialty   | ✅ Yes       | veterinarian, generalist, dermatologist, lawyer-immigration, lawyer-family, home-nursing, it-training, partner-recruitment | veterinarian  |
  | 2        | serviceType | ✅ Yes       | consultation, assistance                                                                                                   | consultation  |
  | 3        | audience    | ✅ Yes       | client, partner                                                                                                            | client        |
  | 4        | language    | ✅ Yes       | en, fr, es, pt-br, de, it                                                                                                  | en            |
  | 5        | location    | ⚠️ Optional | Country code (us, fr, ca) or city (paris, newyork, montreal)                                                               | us or newyork |
  | 6        | variant     | ⚠️ Optional | Creative/test variant (ugc, video, image, a, b, test1)                                                                     | ugc           |

  ✅ Real-World Examples

  Client Campaigns (with location)

  generalist-consultation-client-en

  # Veterinary teleconsultation for US clients, New York targeting
  ✅ veterinarian-consultation-client-en-newyork-ugc

  # Home nursing assistance for French clients in Paris
  ✅ home-nursing-assistance-client-fr-paris-video

  # Psychology consultation for Brazilian clients in São Paulo
  ✅ psychology-consultation-client-pt-br-saopaulo-image

  # Immigration lawyer for Canadian clients (French speakers)
  ✅ lawyer-immigration-consultation-client-fr-canada-a

  Client Campaigns (without location - international)

  # Veterinary teleconsultation for all English-speaking clients
  ✅ veterinarian-consultation-client-en-video

  # IT training for Spanish-speaking clients
  ✅ it-training-consultation-client-es-ugc

  # Dermatology consultation for French clients (no geo-targeting)
  ✅ dermatologist-consultation-client-fr-image

  Partner Recruitment Campaigns

  # Recruiting veterinarian partners in France
  ✅ veterinarian-consultation-partner-fr-france-video

  # Recruiting lawyers (immigration) in Canada
  ✅ lawyer-immigration-consultation-partner-en-canada-ugc

  # General partner recruitment (no specialty specified)
  ✅ partner-recruitment-consultation-partner-en-b

  # IT trainers in US (New York)
  ✅ it-training-consultation-partner-en-newyork-video

  ❌ What to Avoid

  # Missing audience indicator
  ❌ veterinarian-consultation-en-ugc  # Is this client or partner?

  # Wrong order
  ❌ client-en-veterinarian-consultation-ugc  # Hard to parse

  # Using full country names instead of codes
  ❌ veterinarian-consultation-client-english-united-states-ugc

  # Mixing underscores and hyphens
  ❌ veterinarian_consultation-client-en-ugc

  # Spaces or special characters
  ❌ veterinarian consultation client en ugc
  ❌ veterinarian-consultation-client-en_ugc!