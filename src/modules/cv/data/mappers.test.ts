import { toCv, toSectionLayout } from "./mappers";
import { cvContract } from "./__fixtures__/cv-contracts";
import type { SectionLayoutContract } from "./contracts";

describe("toSectionLayout", () => {
  const contract: SectionLayoutContract = {
    mainOrder: ["summary", "experience"],
    sideOrder: ["skills"],
    hidden: ["certifications"],
    titles: { experience: "Work History" },
  };

  it("maps the layout blob into the domain shape", () => {
    expect(toSectionLayout(contract)).toEqual({
      mainOrder: ["summary", "experience"],
      sideOrder: ["skills"],
      hidden: ["certifications"],
      titles: { experience: "Work History" },
    });
  });

  it("copies arrays and the titles object (no contract references leak)", () => {
    const result = toSectionLayout(contract);

    expect(result.mainOrder).not.toBe(contract.mainOrder);
    expect(result.titles).not.toBe(contract.titles);

    result.mainOrder.push("mutated");
    result.titles.skills = "mutated";
    expect(contract.mainOrder).toEqual(["summary", "experience"]);
    expect(contract.titles).toEqual({ experience: "Work History" });
  });
});

describe("toCv layout", () => {
  it("maps a present layout onto the domain CV", () => {
    const layout: SectionLayoutContract = {
      mainOrder: ["summary"],
      sideOrder: ["skills"],
      hidden: [],
      titles: {},
    };
    const result = toCv({ ...cvContract, layout });

    expect(result.layout).toEqual(layout);
  });

  it("maps a missing layout to null", () => {
    const result = toCv({ ...cvContract, layout: undefined });

    expect(result.layout).toBeNull();
  });
});
