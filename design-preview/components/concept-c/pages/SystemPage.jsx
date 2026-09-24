"use client";

import { SystemHead } from "../system/SystemHead";
import { SYSTEM_SECTIONS, SystemIndex, SystemSection } from "../system/SystemSection";
import { TokenBoard } from "../system/TokenBoard";
import { TypeBoard } from "../system/TypeBoard";
import { GeometryBoard } from "../system/GeometryBoard";
import { ButtonBoard } from "../system/ButtonBoard";
import { InputBoard } from "../system/InputBoard";
import { BadgeBoard } from "../system/BadgeBoard";
import { CardBoard } from "../system/CardBoard";
import { FeedbackBoard } from "../system/FeedbackBoard";
import { NavigationBoard } from "../system/NavigationBoard";

const BOARDS = {
  colour: TokenBoard,
  type: TypeBoard,
  geometry: GeometryBoard,
  buttons: ButtonBoard,
  inputs: InputBoard,
  badges: BadgeBoard,
  cards: CardBoard,
  feedback: FeedbackBoard,
  navigation: NavigationBoard,
};

export function SystemPage() {
  return (
    <div>
      <SystemHead />
      <div className="c-container grid gap-10 py-10 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-14 lg:py-14">
        <SystemIndex />
        <div className="min-w-0">
          {SYSTEM_SECTIONS.map((section, index) => {
            const Board = BOARDS[section.id];
            return (
              <SystemSection key={section.id} id={section.id} index={index} title={section.title}>
                <Board />
              </SystemSection>
            );
          })}
        </div>
      </div>
    </div>
  );
}
